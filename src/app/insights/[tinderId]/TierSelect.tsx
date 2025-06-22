import { Button } from "@/app/_components/ui/button";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/app/_components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";

import { useInsightsProvider } from "./InsightsProvider";
import { api } from "@/trpc/react";
import { useState } from "react";

export function TierSelect() {
  const { myTinderId } = useInsightsProvider();

  return (
    <div className="grid grid-cols-3 gap-4">
      <PricingCard
        title="Basic"
        description="Basic profile upgrade"
        features={["Verified Badge", "Priority Support"]}
        actionLabel="Purchase"
        popular={false}
        exclusive={false}
        price={5}
        ctaUrl="https://swipestats.lemonsqueezy.com/buy/594b73d2-8988-4886-ba0a-5e5bf61e752a"
      />
      <PricingCard
        title="Plus"
        description="Basic profile upgrade"
        features={["Verified Badge", "Priority Support"]}
        actionLabel="Purchase"
        popular={true}
        exclusive={false}
        price={10}
        ctaUrl={`https://swipestats.lemonsqueezy.com/buy/594b73d2-8988-4886-ba0a-5e5bf61e752a?checkout[custom][tinderId]=${myTinderId}`}
      />
      <PricingCard
        title="Premium"
        description="Basic profile upgrade"
        features={["Verified Badge", "Priority Support"]}
        actionLabel="Purchase"
        popular={false}
        exclusive={true}
        price={20}
        ctaUrl="https://swipestats.lemonsqueezy.com/buy/594b73d2-8988-4886-ba0a-5e5bf61e752a"
      />
    </div>
  );
}

type PricingCardProps = {
  title: string;
  price?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
  ctaUrl: string;
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  ctaUrl,
}: PricingCardProps) => {
  const { myTinderId } = useInsightsProvider();

  const createCheckout = api.purchases.createCheckout.useMutation({
    onSuccess: (url) => {
      window.location.href = url;
    },
    // onSettled: () => {
    //   setLoading(false);
    // },
  });
  const [loading, setLoading] = useState(false);

  return (
    <Card
      className={cn(
        "relative mx-auto flex h-full flex-col justify-between p-6 sm:mx-0",
        exclusive
          ? "animate-background-shine bg-[linear-gradient(110deg,#3a3b42,45%,#4a4b52,55%,#3a3b42)] bg-[length:200%_100%]"
          : "bg-white",
        popular ? "border-2 border-rose-400" : "border border-zinc-200",
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent" />
        </div>
      )}
      <div>
        <CardHeader className="space-y-2 p-0">
          <CardTitle
            className={cn(
              "text-xl font-semibold",
              exclusive ? "text-white" : "text-zinc-900",
            )}
          >
            {title}
          </CardTitle>
          <div className={cn("flex items-baseline gap-1")}>
            <h3
              className={cn(
                "text-3xl font-bold",
                exclusive ? "text-white" : "text-zinc-900",
              )}
            >
              {price ? "$" + price : "Custom"}
            </h3>
            {/* <span
            className={cn(
              "text-sm",
              exclusive ? "text-zinc-300" : "text-zinc-500",
            )}
          >
            {price ? "/month" : null}
          </span> */}
          </div>
          <CardDescription
            className={cn(
              "text-sm",
              exclusive ? "text-zinc-300" : "text-zinc-500",
            )}
          >
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-3">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} exclusive={exclusive} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-6 p-0">
        <Button
          className={cn(
            "relative w-full",
            exclusive
              ? "bg-white text-black hover:bg-zinc-100"
              : "bg-zinc-900 text-white hover:bg-zinc-800",
          )}
          onClick={() => {
            setLoading(true);
            createCheckout.mutate({
              tinderId: myTinderId,
              product: "swipestatsPlus",
            });
          }}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CheckItem = ({
  text,
  exclusive,
}: {
  text: string;
  exclusive?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <CheckCircle2Icon size={18} className="text-green-500" />
    <p className={cn("text-sm", exclusive ? "text-zinc-300" : "text-zinc-600")}>
      {text}
    </p>
  </div>
);
