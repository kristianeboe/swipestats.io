import { env } from "@/env";

type LemonSqueezyProductId =
  | "datasetSample"
  | "datasetFull"
  | "swipestatsPlus"
  | "aiDatingPhotos";

const product: Record<
  LemonSqueezyProductId,
  Record<
    "test" | "prod",
    {
      variantId: number;
      price?: number;
      currency?: string;
      name?: string;
      description?: string;
      checkoutUrl?: string;
    }
  >
> = {
  // test mode
  datasetSample: {
    test: {
      variantId: 537493,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/1e1ee0bc-f82b-460a-aee2-f88b8c352e08",
    },
    prod: {
      variantId: 470938,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/2c92db51-3b31-4571-ae37-ed7e8e98c937",
    },
  },
  datasetFull: {
    test: {
      variantId: 537493,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/1e1ee0bc-f82b-460a-aee2-f88b8c352e08",
    },
    prod: {
      variantId: 456562,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/2c92db51-3b31-4571-ae37-ed7e8e98c937",
    },
  },
  swipestatsPlus: {
    test: {
      variantId: 624661,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/e362e7c3-5fba-4e46-8134-ead1e9da8847",
    },
    prod: {
      variantId: 624630,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/267432c5-fef7-4bfc-9738-ff9523b03d87",
    },
  },
  aiDatingPhotos: {
    test: {
      variantId: 453444,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/09d2ac28-81db-4784-953a-df22261344de",
    },
    prod: {
      variantId: 314518,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/ef597a65-3259-4575-ac81-9359a98865e6",
    },
  },
} as const;

export function getProductData(productId: LemonSqueezyProductId) {
  const keyEnv = env.NEXT_PUBLIC_IS_PROD ? "prod" : "test";
  return product[productId][keyEnv];
}
