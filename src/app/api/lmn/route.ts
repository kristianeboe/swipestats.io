import { type NextRequest, NextResponse } from "next/server";
import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "@/env";

// Initialize the Lemon Squeezy client
lemonSqueezySetup({
  apiKey: env.LEMONSQUEEZY_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    // const { productId, variantId } = body;

    // Create a checkout session
    const checkoutSession = await createCheckout(97795, 455719);

    // Return the checkout URL
    return NextResponse.json({
      checkoutUrl: checkoutSession.data?.data.attributes.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
