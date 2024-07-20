import { type Content } from "@prismicio/client";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/20/solid";

import { type SliceComponentProps } from "@prismicio/react";
import { annualPriceWithTwoMonthsFree } from "@/lib/utils";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

/**
 * Props for `PricingSection`.
 */
export type PricingSectionProps =
  SliceComponentProps<Content.PricingSectionSlice>;

/**
 * Component for "PricingSection" Slices.
 */
const PricingSection = ({ slice }: PricingSectionProps): JSX.Element => {
  if (slice.variation === "threeTiersWithDividers") {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-rose-600">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose the right plan for&nbsp;you
            </p>
          </div>
          {/* <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p> */}
          <div className="mt-20 flow-root">
            <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
              {/* Tier 1 */}
              <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                <h3
                  id={"tier1"}
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {slice.primary.tier_1_name}
                </h3>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {slice.primary.tier_1_price}
                  </span>
                  {slice.primary.price_is_pr_month && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  )}
                </p>
                {slice.primary.price_is_pr_month && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {
                      annualPriceWithTwoMonthsFree(slice.primary.tier_1_price)
                        .effectiveMonthlyPrice
                    }{" "}
                    per month if paid annually
                  </p>
                )}

                <a
                  href={getPrismicLinkUrl(slice.primary.tier_1_cta_href)}
                  aria-describedby={"tier1"}
                  className="mt-10 block rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Buy plan
                </a>
                <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">
                  Everything necessary to get started.
                </p>
                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {slice.primary.tier_1_features.map(({ feature }) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-rose-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tier 2 */}
              <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                <h3
                  id={"tier2"}
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {slice.primary.tier_2_name}
                </h3>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {slice.primary.tier_2_price}
                  </span>
                  {slice.primary.price_is_pr_month && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  )}
                </p>

                {slice.primary.price_is_pr_month && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {
                      annualPriceWithTwoMonthsFree(slice.primary.tier_2_price)
                        .effectiveMonthlyPrice
                    }{" "}
                    per month if paid annually
                  </p>
                )}
                <a
                  href={getPrismicLinkUrl(slice.primary.tier_2_cta_href)}
                  aria-describedby={"tier2"}
                  className="mt-10 block rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Buy plan
                </a>
                <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">
                  Everything in {slice.primary.tier_1_name}, plus more!
                </p>
                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {slice.primary.tier_2_features.map(({ feature }) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-rose-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tier 3 */}
              <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                <h3
                  id={"tier3"}
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {slice.primary.tier_3_name}
                </h3>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {slice.primary.tier_3_price}
                  </span>
                  {slice.primary.price_is_pr_month && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  )}
                </p>
                {slice.primary.price_is_pr_month && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {
                      annualPriceWithTwoMonthsFree(slice.primary.tier_3_price)
                        .effectiveMonthlyPrice
                    }{" "}
                    per month if paid annually
                  </p>
                )}
                <a
                  href={getPrismicLinkUrl(slice.primary.tier_3_cta_href)}
                  aria-describedby={"tier3"}
                  className="mt-10 block rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Buy plan
                </a>
                <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">
                  Our most comprehensive plan.
                </p>
                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {slice.primary.tier_3_features.map(({ feature }) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-rose-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slice.variation === "singleTier")
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {slice.primary.heading}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {slice.primary.description}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {slice.primary.sub_heading}
              </h3>
              <p className="mt-6 text-base leading-7 text-gray-600">
                {slice.primary.sub_description}
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-rose-600">
                  What’s included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {slice.primary.features.map(({ feature }) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-rose-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="h-full rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">
                    Pay once, own it forever
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      ${slice.primary.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                      USD
                    </span>
                  </p>
                  <a
                    href={getPrismicLinkUrl(slice.primary.cta_link)}
                    className="mt-10 block w-full rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Get access
                  </a>
                  <p className="mt-6 text-xs leading-5 text-gray-600">
                    Invoices and receipts available for easy company
                    reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const tiers = [
    {
      name: "Hobby",
      id: "tier-hobby",
      href: "#",
      priceMonthly: "$49",
      description:
        "Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.",
      features: [
        "5 products",
        "Up to 1,000 subscribers",
        "Basic analytics",
        "48-hour support response time",
      ],
    },
    {
      name: "Team",
      id: "tier-team",
      href: "#",
      priceMonthly: "$79",
      description:
        "Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.",
      features: [
        "Unlimited products",
        "Unlimited subscribers",
        "Advanced analytics",
        "1-hour, dedicated support response time",
        "Marketing automations",
      ],
    },
  ];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="isolate overflow-hidden bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-rose-400">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The right price for you,{" "}
              <br className="hidden sm:inline lg:hidden" />
              whoever you are
            </p>
          </div>
          <div className="relative mt-6">
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
              numquam eligendi quos odit doloribus molestiae voluptatum.
            </p>
            <svg
              viewBox="0 0 1208 1024"
              className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
            >
              <ellipse
                cx={604}
                cy={512}
                rx={604}
                ry={512}
                fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
              />
              <defs>
                <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="flow-root bg-white pb-24 sm:pb-32">
          <div className="-mt-80">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                  >
                    <div>
                      <h3
                        id={tier.id}
                        className="text-base font-semibold leading-7 text-rose-600"
                      >
                        {tier.name}
                      </h3>
                      <div className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          {tier.priceMonthly}
                        </span>
                        <span className="text-base font-semibold leading-7 text-gray-600">
                          /month
                        </span>
                      </div>
                      <p className="mt-6 text-base leading-7 text-gray-600">
                        {tier.description}
                      </p>
                      <ul
                        role="list"
                        className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
                      >
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex gap-x-3">
                            <CheckIcon
                              aria-hidden="true"
                              className="h-6 w-5 flex-none text-rose-600"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className="mt-8 block rounded-md bg-rose-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                      Get started today
                    </a>
                  </div>
                ))}
                <div className="flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                  <div className="lg:min-w-0 lg:flex-1">
                    <h3 className="text-lg font-semibold leading-8 tracking-tight text-rose-600">
                      Discounted
                    </h3>
                    <p className="mt-1 text-base leading-7 text-gray-600">
                      Dolor dolores repudiandae doloribus. Rerum sunt aut eum.
                      Odit omnis non voluptatem sunt eos nostrum.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="rounded-md px-3.5 py-2 text-sm font-semibold leading-6 text-rose-600 ring-1 ring-inset ring-rose-200 hover:ring-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Buy discounted license{" "}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
