import DatasetPurchaseEmail from "@/emails/DatasetPurchaseEmail";
import { env } from "@/env";
import { createSubLogger } from "@/lib/tslog";
import { sendReactEmail } from "@/server/api/services/email.service";
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

type ProductId =
  | "datasetSample"
  | "datasetFull"
  | "swipestatsPlus"
  | "aiDatingPhotos";
const productToVariantId: Record<ProductId, Record<"test" | "prod", number>> = {
  // test mode
  datasetSample: {
    test: 537493,
    prod: 470938,
  },
  datasetFull: {
    test: 537493,
    prod: 456562,
  },
  swipestatsPlus: {
    test: 624661,
    prod: 624630,
  },
  aiDatingPhotos: { test: 453444, prod: 314518 },
} as const;

export async function POST(request: Request) {
  const keyEnv = env.NEXT_PUBLIC_IS_PROD ? "prod" : "test";
  log.info("Received Lemon Squeezy webhook");

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

  const dataPurchaseVariantIds = [
    productToVariantId.datasetSample[keyEnv],
    productToVariantId.datasetFull[keyEnv],
  ];

  const purchaseVariantId =
    attributes.variant_id ?? attributes.first_order_item.variant_id;

  if (!purchaseVariantId) {
    throw new Error("No purchase variant id found");
  }

  switch (eventName) {
    case "order_created":
      log.info("Processing order_created event", { purchaseVariantId });

      if (dataPurchaseVariantIds.includes(purchaseVariantId)) {
        log.info("Processing dataset purchase", {
          type:
            purchaseVariantId === productToVariantId.datasetFull[keyEnv]
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
              purchaseVariantId === productToVariantId.datasetFull[keyEnv]
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
      } else if (
        purchaseVariantId === productToVariantId.aiDatingPhotos[keyEnv]
      ) {
        log.info("Processing AI Dating Photos purchase", {
          customerEmail: attributes.user_email,
        });

        await api.aiDatingPhotosRouter.onPurchase({
          customerEmail: attributes.user_email,
        });
        log.info("Completed AI Dating Photos purchase processing");
      } else if (
        purchaseVariantId === productToVariantId.swipestatsPlus[keyEnv]
      ) {
        log.info("Processing Swipestats Plus purchase", {
          tinderId: data.meta.custom_data.tinderId,
          customerEmail: attributes.user_email,
        });

        await db.tinderProfile.update({
          where: { tinderId: data.meta.custom_data.tinderId },
          data: { user: { update: { swipestatsTier: "PLUS" } } },
        });
        log.info("Updated user tier to PLUS");
      }

      break;
    default:
      log.warn("Received unknown event type", { eventName });
      break;
  }

  log.info("Webhook processing completed successfully");
  return NextResponse.json({ success: true });
}
