"use client";
import { api } from "@/trpc/react";
/*
Newsletter flow
1. User enters email, checks or uncheks 3 day reminder, and clicks notify me
2. User is shown a success message, or that they are already subscribed
3. User is sent an email with a link to confirm their subscription
4. User clicks the link and is shown a success message
5. Regardless the user receives the 3 day notification email if they checked the box
6. In any other email they receive they can unsubscribe
7. The unsusubscribe link takes them to a page where they can manage their notifications, email is unsubbed on load
*/

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function NewsletterCTA() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const newsletterSubscribeMutation = api.newsletter.subscribe.useMutation();

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    newsletterSubscribeMutation.mutate({
      email: data.email,
    });
    setSubmitted(true);
  });

  return (
    <div
      id="newsletter"
      className="relative isolate flex flex-col gap-10 overflow-hidden rounded-3xl bg-gray-900 px-6 py-24 shadow-2xl sm:px-24 md:h-96 xl:flex-row xl:items-center xl:py-32"
    >
      <div className="max-w-2xl text-white xl:max-w-none xl:flex-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Afraid you&apos;ll forget about Swipestats?
        </h2>
        <p className="mt-2">
          Sign up to our newsletter and we&apos;ll send you a reminder in 3
          days, along with other useful dating tips and news
        </p>
      </div>
      {submitted ? (
        <div className="thank-you-card mx-auto mt-10 max-w-lg rounded-lg bg-gradient-to-r from-rose-900 to-rose-500 p-8 text-white shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">
            Thank you for subscribing! 🙌
          </h2>
          <p className="text-md">
            You&apos;ve successfully been added to our mailing list.
          </p>
        </div>
      ) : (
        <form className="w-full max-w-md" onSubmit={onSubmit}>
          <div className="flex gap-x-4">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter your email"
              {...form.register("email", { required: true })}
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Notify me
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            We care about your data. Read our{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="font-semibold text-white"
            >
              privacy&nbsp;policy
            </Link>
            .
          </p>
        </form>
      )}

      {/* <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient
                id="759c1415-0410-454c-8f7c-9a820de03641"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg> */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
        aria-hidden="true"
      >
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#newGradient)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient
            id="newGradient"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(512 512) rotate(90) scale(512)"
          >
            <stop stopColor="rgb(225, 29, 72)" />
            <stop offset="1" stopColor="rgb(225, 29, 72)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
