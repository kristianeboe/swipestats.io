"use client";

import { cn } from "@/lib/utils";
import { Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

const pricing = {
  frequencies: [
    { value: "monthly", label: "Monthly", priceSuffix: "/month" },
    { value: "annually", label: "Annually", priceSuffix: "/year" },
  ],
  tiers: [
    {
      name: "Freelancer",
      id: "tier-freelancer",
      href: "#",
      price: { monthly: "$15", annually: "$144" },
      description: "The essentials to provide your best work for clients.",
      features: [
        "5 products",
        "Up to 1,000 subscribers",
        "Basic analytics",
        "48-hour support response time",
      ],
      mostPopular: false,
    },
    {
      name: "Startup",
      id: "tier-startup",
      href: "#",
      price: { monthly: "$30", annually: "$288" },
      description: "A plan that scales with your rapidly growing business.",
      features: [
        "25 products",
        "Up to 10,000 subscribers",
        "Advanced analytics",
        "24-hour support response time",
        "Marketing automations",
      ],
      mostPopular: true,
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "#",
      price: { monthly: "$48", annually: "$576" },
      description: "Dedicated support and infrastructure for your company.",
      features: [
        "Unlimited products",
        "Unlimited subscribers",
        "Advanced analytics",
        "1-hour, dedicated support response time",
        "Marketing automations",
        "Custom reporting tools",
      ],
      mostPopular: false,
    },
  ],
} as const;

export function PricingTiers() {
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  return (
    <>
      <div className="mt-16 flex justify-center">
        <fieldset aria-label="Payment frequency">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
          >
            {pricing.frequencies.map((option) => (
              <Radio
                key={option.value}
                value={option}
                className={({ checked }) =>
                  cn(
                    checked ? "bg-indigo-500" : "",
                    "cursor-pointer rounded-full px-2.5 py-1",
                  )
                }
              >
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        </fieldset>
      </div>
      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {pricing.tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              tier.mostPopular
                ? "bg-white/5 ring-2 ring-indigo-500"
                : "ring-1 ring-white/10",
              "rounded-3xl p-8 xl:p-10",
            )}
          >
            <div className="flex items-center justify-between gap-x-4">
              <h2
                id={tier.id}
                className="text-lg font-semibold leading-8 text-white"
              >
                {tier.name}
              </h2>
              {tier.mostPopular ? (
                <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                  Most popular
                </p>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-300">
              {tier.description}
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">
                {tier.price[frequency.value]}
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-300">
                {frequency.priceSuffix}
              </span>
            </p>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={cn(
                tier.mostPopular
                  ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                  : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              )}
            >
              Buy plan
            </a>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-white"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
