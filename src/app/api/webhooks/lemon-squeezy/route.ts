import DatasetPurchaseEmail from "@/emails/DatasetPurchaseEmail";
import { env } from "@/env";
import { getProductData } from "@/lib/constants/lemonSqueezy.constants";
import { createSubLogger } from "@/lib/tslog";
import { sendReactEmail } from "@/server/api/services/email.service";
import { sendInternalSlackMessage } from "@/server/api/services/internal-slack.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import crypto from "crypto";
import { NextResponse } from "next/server";

const log = createSubLogger("lemon-squeezy");

interface WebhookData {
  meta: {
    event_name: string;
    custom_data: {
      tinderId: string;
      [key: string]: string;
    };
  };
  data: {
    attributes: {
      // license_key_created
      key?: string;
      disabled?: boolean;

      ///

      order_id: number;
      user_name: string;
      user_email: string;
      variant_id: number;
      status: string; // ?
      status_formatted: string; // ?
      //   renews_at: string; // ?
      //   ends_at: string; // ?
      //   trial_ends_at: string; // ?
      first_order_item: {
        id: number;
        price: number;
        order_id: number;
        price_id: number;
        quantity: number;
        test_mode: boolean;
        created_at: string;
        product_id: number;
        updated_at: string;
        variant_id: number;
        product_name: string;
        variant_name: string;
      };
    };
    id: string;
  };
}

export async function POST(request: Request) {
  log.info("Received Lemon Squeezy webhook");

  try {
    const rawBody = await request.text();
    log.debug("Raw webhook payload", { rawBody });

    const secret = env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(
      request.headers.get("X-Signature") ?? "",
      "utf8",
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    const data = JSON.parse(rawBody) as WebhookData;
    log.info("Processing webhook event", {
      eventName: data.meta.event_name,
      custom_data: data.meta?.custom_data,
      orderId: data.data.attributes.order_id,
      variantId: data.data.attributes.variant_id,
      customerEmail: data.data.attributes.user_email,
      first_order_item: data.data.attributes.first_order_item,
    });

    const meta = data.meta;
    const eventName = meta.event_name;
    const attributes = data.data.attributes;
    const objId = data.data.id;

    const sampleProductData = getProductData("datasetSample");
    const fullProductData = getProductData("datasetFull");
    const aiDatingPhotosProductData = getProductData("aiDatingPhotos");
    const swipestatsPlusProductData = getProductData("swipestatsPlus");
    const dataPurchaseVariantIds = [
      sampleProductData.variantId,
      fullProductData.variantId,
    ];

    const purchaseVariantId =
      attributes.variant_id ?? attributes.first_order_item.variant_id;

    switch (eventName) {
      case "license_key_created":
        const key = attributes.key;
        log.info("Processing license_key_created event", {
          key,
          disabled: attributes.disabled,
        });
        break;
      case "order_created":
        if (!purchaseVariantId) {
          throw new Error("No purchase variant id found");
        }
        log.info("Processing order_created event", { purchaseVariantId });

        if (dataPurchaseVariantIds.includes(purchaseVariantId)) {
          log.info("Processing dataset purchase", {
            type:
              purchaseVariantId === fullProductData.variantId
                ? "full"
                : "sample",
            customerEmail: attributes.user_email,
          });

          await sendReactEmail(
            DatasetPurchaseEmail,
            {
              customerEmail: attributes.user_email,
              customerName: attributes.user_name,
              datasetName:
                purchaseVariantId === fullProductData.variantId
                  ? "Full Package"
                  : "Sample",
              downloadLink: "https://swipestats.io/", // Replace with actual download link
            },
            {
              subject:
                "Here is your data. Thank you for your Swipestats.io purchase!",
              to: attributes.user_email,
              bcc: ["kristian.e.boe@gmail.com", "kris@swipestats.io"],
            },
          );
          log.info("Sent dataset purchase confirmation email");

          analyticsTrackServer(attributes.user_email, "Dataset Purchase", {
            datasetType:
              purchaseVariantId === fullProductData.variantId
                ? "full"
                : "sample",
            orderId: attributes.order_id,
            amount: attributes.first_order_item.price,
            environment: env.NEXT_PUBLIC_MANUAL_ENV,
          });

          // Send Slack notification for dataset purchase
          sendInternalSlackMessage("sales", "🎉 New Dataset Purchase!", {
            customerName: attributes.user_name,
            customerEmail: attributes.user_email,
            datasetType:
              purchaseVariantId === fullProductData.variantId
                ? "Full Package"
                : "Sample",
            orderId: attributes.order_id,
            amount: attributes.first_order_item.price,
            environment: env.NEXT_PUBLIC_MANUAL_ENV,
          });
        } else if (purchaseVariantId === aiDatingPhotosProductData.variantId) {
          log.info("Processing AI Dating Photos purchase", {
            customerEmail: attributes.user_email,
          });

          await api.aiDatingPhotosRouter.onPurchase({
            customerEmail: attributes.user_email,
          });
          log.info("Completed AI Dating Photos purchase processing");

          // Track AI photos purchase in PostHog
          analyticsTrackServer(
            attributes.user_email,
            "AI Dating Photos Purchase",
            {
              orderId: attributes.order_id,
              amount: attributes.first_order_item.price,
              environment: env.NEXT_PUBLIC_MANUAL_ENV,
            },
          );

          // Send Slack notification for AI photos purchase
          sendInternalSlackMessage(
            "sales",
            "📸 New AI Dating Photos Purchase!",
            {
              customerName: attributes.user_name,
              customerEmail: attributes.user_email,
              orderId: attributes.order_id,
              amount: attributes.first_order_item.price,
              environment: env.NEXT_PUBLIC_MANUAL_ENV,
            },
          );
        } else if (purchaseVariantId === swipestatsPlusProductData.variantId) {
          log.info("Processing Swipestats Plus purchase", {
            tinderId: data.meta.custom_data.tinderId,
            customerEmail: attributes.user_email,
          });

          const updatedProfile = await db.tinderProfile.update({
            where: { tinderId: data.meta.custom_data.tinderId },
            data: { user: { update: { swipestatsTier: "PLUS" } } },
            include: { user: true },
          });
          const userId = updatedProfile.user.id;
          log.info("Updated user tier to PLUS");

          // Track Plus subscription in PostHog
          analyticsTrackServer(userId, "Plus Subscription Purchase", {
            userId,
            tinderId: data.meta.custom_data.tinderId,
            orderId: attributes.order_id,
            amount: attributes.first_order_item.price,
            environment: env.NEXT_PUBLIC_MANUAL_ENV,
          });

          // Send Slack notification for Plus purchase
          sendInternalSlackMessage(
            "sales",
            "⭐ New Swipestats Plus Purchase!",
            {
              customerName: attributes.user_name,
              customerEmail: attributes.user_email,
              tinderId: data.meta.custom_data.tinderId,
              swipestatsUrl: `https://swipestats.io/insights/${data.meta.custom_data.tinderId}`,
              orderId: attributes.order_id,
              amount: attributes.first_order_item.price,
              environment: env.NEXT_PUBLIC_MANUAL_ENV,
            },
          );
        }

        break;
      default:
        log.warn("Received unknown event type", { eventName });
        break;
    }

    log.info("Webhook processing completed successfully");
    return NextResponse.json({
      success: true,
      processed: {
        eventName,
        orderId: attributes.order_id,
        variantId: purchaseVariantId,
        customerEmail: attributes.user_email,
        timestamp: new Date().toISOString(),
        objectId: objId,
        productType: dataPurchaseVariantIds.includes(purchaseVariantId)
          ? "dataset"
          : purchaseVariantId === aiDatingPhotosProductData.variantId
            ? "aiDatingPhotos"
            : purchaseVariantId === swipestatsPlusProductData.variantId
              ? "swipestatsPlus"
              : "unknown",
      },
    });
  } catch (error) {
    log.error("Error processing webhook", { error });

    // Track webhook error in PostHog
    analyticsTrackServer("system", "Lemon Squeezy Webhook Error", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      environment: env.NEXT_PUBLIC_MANUAL_ENV,
    });

    // Send Slack notification for webhook errors
    sendInternalSlackMessage("sales", "❌ Lemon Squeezy Webhook Error", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      environment: env.NEXT_PUBLIC_MANUAL_ENV,
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
