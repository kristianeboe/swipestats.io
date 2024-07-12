import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

import Link from "next/link";

import { HeroHeading } from "./HeroHeading";
import Image from "next/image";
import { Text } from "@/app/_components/ui/text";
import DataRequestSupport from "./DataRequestSupport";
import Testimonials from "./Testimonials";
import { FAQ } from "./FAQ";
import NewsletterCTA from "./NewsletterCTA";
import { StarIcon } from "lucide-react";
import { Blog } from "./blog/BlogSection";
import { About } from "./AboutSection";

const features = [
  {
    name: "Parse the Tinder data file",
    description:
      "Extract anonymous data from the data.json file you get from Tinder",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Submit your anonymized data",
    description: "Upload the data and get additional insigths and metrics",
    icon: LockClosedIcon,
  },
  {
    name: "Compare with others",
    description:
      "Visualize your data against others, or against segments og gender and age",
    icon: ArrowPathIcon,
  },
  {
    name: "Open source on Github",
    description:
      "This project is completely open source. Inspect the code yourself, and even contribute!",
    icon: FingerPrintIcon,
  },
];

const stats = [
  { label: "Transactions every 24 hours", value: "44 million" },
  { label: "Assets under holding", value: "$119 trillion" },
  { label: "New users annually", value: "46,000" },
];

const tiers = [
  {
    name: "Small Sample",
    id: "small-sample",
    href: "mailto:kristian.e.boe@gmail.com?subject=Swipestats%20Data%20Request%3A%20Sample&body=This%20tier%20is%20currently%20free%2C%20just%20write%20me%20what%20you%20are%20intending%20to%20use%20the%20data%20for%20and%20I'll%20reach%20out%20with%20the%20dataset.",
    price: "$15",
    description: "Get started",
    features: ["3 profiles", "Perfect to test and learn about the data model"],
    mostPopular: false,
  },
  {
    name: "Full package",
    id: "full-package",
    href: "https://buy.stripe.com/fZe9BWdue9U59Nu4gi",
    price: "$49",
    description: "Scale your analysis and get access to future datasets",
    features: [
      "1,000 profiles",
      "Access to future datasets",
      "Analyze at scale",
      "Direct support",
    ],
    mostPopular: true,
  },
  {
    name: "University / Enterprise",
    id: "tier-enterprise",
    href: "mailto:kristian.e.boe@gmail.com?subject=University%20%2F%20Enterprise%20Plan%20Inquiry&body=Hello%2C%0D%0A%0D%0AI%27m%20interested%20in%20the%20University%20%2F%20Enterprise%20plan%20for%20%245000.%20I%20would%20like%20to%20know%20more%20about%20the%20following%3A%0D%0A%0D%0A-%20License%20to%20distribute%20datasets%20to%20students%0D%0A-%204k%2B%20profiles%0D%0A-%20Direct%20support%0D%0A%0D%0APlease%20provide%20me%20with%20additional%20information%20and%20the%20next%20steps%20to%20get%20started.%0D%0A%0D%0AThank%20you%2C%0D%0A%5BYour%20Name%5D",

    price: "$5000",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Licence to distribute datasets to students",
      "4k+ profiles",
      "Direct support",
    ],
    mostPopular: false,
  },
];
const faqs = [
  {
    id: 1,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];

export default function HomePage() {
  return (
    <div className="isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#CF364C] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <HeroHeading />
              <Text.MarketingP>
                Upload your data anonymously and compare it to demographics from
                around the world!
              </Text.MarketingP>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/upload/tinder"
                  className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Get started
                </Link>
                <Link
                  href="/insights/demo"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Live demo <span aria-hidden="true">→</span>
                </Link>
              </div>
              <StarRating />
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  // src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
                  src="/ss2.png"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#CF364C] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Logo cloud */}
      {/* <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
            alt="Transistor"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          />
        </div>
        <div className="mt-16 flex justify-center">
          <p className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/10 hover:ring-gray-900/20">
            <span className="hidden md:inline">
              Transistor saves up to $40,000 per year, per employee by working
              with us.
            </span>
            <a href="#" className="font-semibold text-rose-600">
              <span className="absolute inset-0" aria-hidden="true" /> Read our
              case study <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div> */}

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 pt-32 lg:px-8" id="how-it-works">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-rose-600">
            How it works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            100% anonymous data visualization and comparison
          </p>
          <Text.MarketingP>
            The data file is NOT uploaded to a server, just used to extract your
            relevant, anonymous profile information.
          </Text.MarketingP>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <DataRequestSupport />
      <section className="mx-auto max-w-7xl pt-32 sm:px-6 lg:px-8">
        <NewsletterCTA />
      </section>

      <Blog />

      <Testimonials />

      {/* Pricing section */}
      <div id="pricing" className="py-24 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-rose-600">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get your own dataset
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            Wether it&apos;s for a blog, a research paper, or plain curiosity, a
            dataset from Swipestats will get you on the right track.
          </p>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier, tierIdx) => (
              <div
                key={tier.id}
                className={cn(
                  tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                  tierIdx === 0 ? "lg:rounded-r-none" : "",
                  tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                  "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.id}
                      className={cn(
                        tier.mostPopular ? "text-rose-600" : "text-gray-900",
                        "text-lg font-semibold leading-8",
                      )}
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                      <p className="rounded-full bg-rose-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-rose-600">
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  {/* <p className="mt-4 text-sm leading-6 text-gray-600">
                    {tier.description}
                  </p> */}
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {tier.price}
                    </span>
                    {/* <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span> */}
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-rose-600"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    tier.mostPopular
                      ? "bg-rose-600 text-white shadow-sm hover:bg-rose-500"
                      : "text-rose-600 ring-1 ring-inset ring-rose-200 hover:ring-rose-300",
                    "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
                  )}
                >
                  Buy plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <About />

      {/* <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our mission
          </h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
              <p className="text-xl leading-8 text-gray-600">
                Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque
                id at vitae feugiat egestas ac. Diam nulla orci at in viverra
                scelerisque eget. Eleifend egestas fringilla sapien.
              </p>
              <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                <p>
                  Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                  risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                  Id dolor praesent donec est. Odio penatibus risus viverra
                  tellus varius sit neque erat velit. Faucibus commodo massa
                  rhoncus, volutpat. Dignissim sed eget risus enim. Mattis
                  mauris semper sed amet vitae sed turpis id.
                </p>
                <p className="mt-10">
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien
                  duis odio id et. Id blandit molestie auctor fermentum
                  dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
                  varius vulputate et ultrices hac adipiscing egestas. Iaculis
                  convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
              </div>
            </div>
            <div className="lg:flex lg:flex-auto lg:justify-center">
              <dl className="w-64 space-y-8 xl:w-80">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse gap-y-4"
                  >
                    <dt className="text-base leading-7 text-gray-600">
                      {stat.label}
                    </dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div> */}

      {/* Testimonial section */}
      <div className="mx-auto max-w-7xl pt-32 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 md:px-12 lg:px-20">
          <img
            className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
            // src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
            src="/images/founder2.png"
            alt=""
          />
          <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
          <div
            className="absolute -left-80 -top-56 transform-gpu blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#E11D48] opacity-[0.45]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:transform-gpu md:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-25"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-2xl lg:mx-0">
            {/* <img
              className="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workcation-logo-white.svg"
              alt=""
            /> */}
            <figure>
              <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
                <p>
                  “When I first launched SwipeStats.io, it was nothing more than
                  a fun weekend project, born out of curiosity and a love for
                  data. I could never have imagined it evolving into the
                  platform it is today, reaching thousands of users worldwide.
                  The impact SwipeStats.io has had is beyond anything I could
                  have anticipated.”
                  {/* The journey from a simple idea to a tool that genuinely aids
                  people in navigating the complex world of online dating has
                  been both surprising and deeply rewarding.  */}
                </p>
              </blockquote>
              <figcaption className="mt-6 text-base text-white">
                <div className="font-semibold">Kristian Elset Bø</div>
                <div className="mt-1">Founder of Swipestats.io</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <FAQ />

      {/* CTA section */}
      <div className="relative -z-10 px-6 lg:px-8">
        {/* <div
          className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:bottom-0 sm:right-[calc(50%-6rem)] sm:top-auto sm:translate-y-0 sm:transform-gpu sm:justify-end"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#ff80b5] to-[#E11D48] opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 48.6%, 91.7% 88.5%, 100% 53.9%, 97.4% 18.1%, 92.5% 15.4%, 75.7% 36.3%, 55.3% 52.8%, 46.5% 50.9%, 45% 37.4%, 50.3% 13.1%, 21.3% 36.2%, 0.1% 0.1%, 5.4% 49.1%, 21.4% 36.4%, 58.9% 100%, 73.6% 48.6%)",
            }}
          />
        </div> */}
        <div className="mx-auto max-w-2xl pt-32 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to explore?
            <br />
            Upload your data today
          </h2>
          {/* <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum
            anim id veniam aliqua proident excepteur commodo do ea.
          </p> */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/upload/tinder"
              className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Get started
            </Link>
            <Link
              href="/insights/demo"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Live demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-1/2 right-0 top-full -z-10 hidden -translate-y-1/2 transform-gpu overflow-hidden blur-3xl sm:block"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#E11D48] opacity-30"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StarRating2() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <StarIcon className="fill-primary h-5 w-5" />
        <StarIcon className="fill-primary h-5 w-5" />
        <StarIcon className="fill-primary h-5 w-5" />
        <StarIcon className="fill-primary h-5 w-5" />
        <StarIcon className="fill-primary h-5 w-5" />
      </div>
      <div className="text-sm font-semibold">1000+ users</div>
    </div>
  );
}

function StarRating() {
  return (
    <div className="mt-6">
      <div className="inline-flex items-center divide-x divide-gray-300">
        <div className="flex flex-shrink-0 pr-5">
          <StarIcon2 className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          <StarIcon2 className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          <StarIcon2 className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          <StarIcon2 className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          <StarIcon2 className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500 sm:py-3">
          <span className="font-medium text-gray-900">Rated 5 stars</span> by
          over{" "}
          <span className="font-medium text-rose-500">4000 beta users</span>
        </div>
      </div>
    </div>
  );
}

function StarIcon2(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
