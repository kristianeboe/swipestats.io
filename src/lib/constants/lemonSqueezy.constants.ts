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
    },
    prod: {
      variantId: 470938,
    },
  },
  datasetFull: {
    test: {
      variantId: 537493,
    },
    prod: {
      variantId: 456562,
      checkoutUrl:
        "https://swipestats.lemonsqueezy.com/buy/1e1ee0bc-f82b-460a-aee2-f88b8c352e08",
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
        "https://swipestats.lemonsqueezy.com/buy/2c92db51-3b31-4571-ae37-ed7e8e98c937",
    },
  },
  aiDatingPhotos: {
    test: {
      variantId: 453444,
    },
    prod: {
      variantId: 314518,
    },
  },
} as const;

export function getProductData(productId: LemonSqueezyProductId) {
  const keyEnv = env.NEXT_PUBLIC_IS_PROD ? "prod" : "test";
  return product[productId][keyEnv];
}
