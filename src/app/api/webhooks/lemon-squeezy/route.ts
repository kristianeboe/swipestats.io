import { env } from "@/env";
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

  // if (!crypto.timingSafeEqual(digest, signature)) {
  //   throw new Error("Invalid signature.");
  // }

  const data = JSON.parse(rawBody) as WebhookData;
  const eventName = data.meta.event_name;
  const attributes = data.data.attributes;
  const objId = data.data.id;

  switch (eventName) {
    case "order_created":
      await api.aiDatingPhotosRouter.onPurchase({
        customerEmail: attributes.user_email,
      });

      break;
    default:
      console.log("Unknown event name:", eventName);
      break;
  }

  return NextResponse.json({ success: true });
}
