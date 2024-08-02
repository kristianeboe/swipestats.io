import DatasetPurchaseEmail from "@/emails/DatasetPurchaseEmail";
import { env } from "@/env";
import { sendReactEmail } from "@/server/api/services/email.service";
import { api } from "@/trpc/server";
import crypto from "crypto";
import { NextResponse } from "next/server";

interface WebhookData {
  meta: { event_name: string };
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
      custom_data: Record<string, unknown>;
    };
    id: string;
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();

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
  const eventName = data.meta.event_name;
  const attributes = data.data.attributes;
  const objId = data.data.id;

  const samplePurchaseVariantId = 470938;
  const fullPackagePurchaseVariantId = 456562;
  const aiDatingPhotosPurchaseVariantId = 470939;

  const dataPurchaseVariantIds = [
    samplePurchaseVariantId,
    fullPackagePurchaseVariantId,
  ];

  const purchaseVariantId = attributes.variant_id;

  switch (eventName) {
    case "order_created":
      if (dataPurchaseVariantIds.includes(purchaseVariantId)) {
        // Dataset purchase
        // create purchase token // base it on LM licence key?
        // send success email
        await sendReactEmail(
          DatasetPurchaseEmail,
          {
            customerEmail: attributes.user_email,
            customerName: attributes.user_name,
            datasetName:
              purchaseVariantId === fullPackagePurchaseVariantId
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
      } else if (purchaseVariantId === aiDatingPhotosPurchaseVariantId) {
        // AI Dating Photos purchase
        await api.aiDatingPhotosRouter.onPurchase({
          customerEmail: attributes.user_email,
        });
      }

      break;
    default:
      console.log("Unknown event name:", eventName);
      break;
  }

  return NextResponse.json({ success: true });
}
