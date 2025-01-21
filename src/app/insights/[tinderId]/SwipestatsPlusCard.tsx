"use client";

import { Card } from "@/app/_components/ui/card";
import {
  Book,
  Check,
  CheckIcon,
  CrownIcon,
  MessageCircle,
  Users,
} from "lucide-react";
import { useInsightsProvider } from "./InsightsProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getProductData } from "@/lib/constants/lemonSqueezy.constants";

export const includedSwipestatsPlusFeatures = [
  {
    title: "All demographic comparisons",
    description: "Access detailed demographic insights and trends",
    icon: Users,
  },
  {
    title: "The Swipe Guide",
    description: "Access guides on how to swipe and get matches",
    icon: Book,
  },
  {
    title: "Access to all future updates",
    description: "We will add new features to Swipestats+ over time",
    icon: Check,
  },
  {
    title: "Premium Support",
    description: "Get priority support and feature requests",
    icon: MessageCircle,
  },

  // {
  //   title: "Message analysis",
  //   description: "Deep dive into your messaging patterns and success rates",
  //   icon: MessageCircle,
  // },
  // {
  //   title: "Private forum access",
  //   description: "Join exclusive discussions with other members",
  //   icon: Users,
  // },
  // {
  //   title: "Member resources",
  //   description: "Access premium guides and resources",
  //   icon: Check,
  // },
  // {
  //   title: "Entry to annual conference",
  //   description: "Attend our yearly member conference",
  //   icon: Users
  // },
  // {
  //   title: "Official member t-shirt",
  //   description: "Get exclusive Swipestats+ merchandise",
  //   icon: Crown
  // }
];

const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    priceMonthly: "$29",
    description:
      "The perfect plan if you're just getting started with our product.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$99",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited products",
      "Unlimited subscribers",
      "Advanced analytics",
      "Dedicated support representative",
      "Marketing automations",
      "Custom integrations",
    ],
    featured: true,
  },
];

const TierSelect = () => (
  <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
    {tiers.map((tier, tierIdx) => (
      <div
        key={tier.id}
        className={cn(
          tier.featured
            ? "relative bg-gray-900 shadow-2xl"
            : "bg-white/60 sm:mx-8 lg:mx-0",
          tier.featured
            ? ""
            : tierIdx === 0
              ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
              : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
          "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10",
        )}
      >
        <h3
          id={tier.id}
          className={cn(
            tier.featured ? "text-indigo-400" : "text-indigo-600",
            "text-base/7 font-semibold",
          )}
        >
          {tier.name}
        </h3>
        <p className="mt-4 flex items-baseline gap-x-2">
          <span
            className={cn(
              tier.featured ? "text-white" : "text-gray-900",
              "text-5xl font-semibold tracking-tight",
            )}
          >
            {tier.priceMonthly}
          </span>
          <span
            className={cn(
              tier.featured ? "text-gray-400" : "text-gray-500",
              "text-base",
            )}
          >
            /month
          </span>
        </p>
        <p
          className={cn(
            tier.featured ? "text-gray-300" : "text-gray-600",
            "mt-6 text-base/7",
          )}
        >
          {tier.description}
        </p>
        <ul
          role="list"
          className={cn(
            tier.featured ? "text-gray-300" : "text-gray-600",
            "mt-8 space-y-3 text-sm/6 sm:mt-10",
          )}
        >
          {tier.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon
                aria-hidden="true"
                className={cn(
                  tier.featured ? "text-indigo-400" : "text-indigo-600",
                  "h-6 w-5 flex-none",
                )}
              />
              {feature}
            </li>
          ))}
        </ul>
        <a
          href={tier.href}
          aria-describedby={tier.id}
          className={cn(
            tier.featured
              ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
              : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600",
            "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10",
          )}
        >
          Get started today
        </a>
      </div>
    ))}
  </div>
);

export function SwipestatsPlusCard({ className }: { className?: string }) {
  const { myTinderId, swipestatsTier } = useInsightsProvider();

  if (
    swipestatsTier === "PLUS" &&
    myTinderId !==
      "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5"
  ) {
    return (
      <Card.Container className={cn("w-full flex-1 flex-shrink-0", className)}>
        <Card.Header className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <CrownIcon className="text-primary h-6 w-6" />
          </div>
          <Card.Title className="text-3xl font-bold">
            Welcome to Swipestats+
          </Card.Title>
          <Card.Description className="text-lg">
            You now have full access to all premium features
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {includedSwipestatsPlusFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-card flex items-start gap-3 rounded-lg border p-4"
              >
                <div className="bg-primary/10 rounded-full p-2">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  // return <TierSelect />;

  return (
    <Card.Container className={cn("lg:flex", className)}>
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
          Swipestats+
        </h3>
        {/* <p className="mt-6 text-base/7 text-gray-600">
      Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
      amet indis perferendis blanditiis repellendus etur quidem
      assumenda.
    </p> */}
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm/6 font-semibold text-rose-600">
            What&apos;s included
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
        >
          {includedSwipestatsPlusFeatures.map((feature) => (
            <li key={feature.title} className="flex gap-x-3">
              <feature.icon
                aria-hidden="true"
                className="h-6 w-5 flex-none text-rose-600"
              />
              {feature.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-sm lg:shrink-0">
        <div className="rounded bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs px-8">
            <p className="text-base font-semibold text-gray-600">
              Pay once, access forever
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-semibold tracking-tight text-gray-900">
                $10
              </span>
              <span className="text-sm/6 font-semibold tracking-wide text-gray-600">
                USD
              </span>
            </p>
            {myTinderId ===
            "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5" ? (
              <button
                disabled
                className="mt-10 block w-full rounded-md bg-gray-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm"
              >
                Not available in demo
              </button>
            ) : (
              <a
                href={
                  getProductData("swipestatsPlus").checkoutUrl +
                  `?checkout[custom][tinderId]=${myTinderId}`
                }
                className="mt-10 block w-full rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Get access
              </a>
            )}
            {myTinderId ===
              "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5" && (
              <Link
                href="/upload/tinder"
                className="mt-4 block w-full rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Upload your own data now
              </Link>
            )}
            {/* <p className="mt-6 text-xs/5 text-gray-600">
          Invoices and receipts available for easy company
          reimbursement
        </p> */}
          </div>
        </div>
      </div>
    </Card.Container>
  );
}
