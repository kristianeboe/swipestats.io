"use client";
import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What kind of insights can I gain from SwipeStats.io?",
    answer:
      "You can learn about your swipe patterns, match rates, messaging habits, and more, which can help you understand your behavior on Tinder and how it compares to others'.",
  },
  {
    question:
      "Will my name, contact details, or other personal information be shared?",
    answer:
      "No. SwipeStats.io does not collect or share any personal information such as names, contact details, or IP addresses. All data is fully anonymized and isn't uploaded to a server.",
  },
  {
    question: "Can I use SwipeStats.io for research or an article?",
    answer:
      "Yes, you can! We encourage the use of our anonymized datasets for writing articles or conducting research. You can request access to a dataset with 1000 anonymized profiles.",
    cta: "Get your dataset now.",
  },
  {
    question: "How do I request my data from Tinder?",
    answer:
      "You can request your data by logging into your Tinder account at https://account.gotinder.com/data and following the instructions provided.",
  },
  {
    question: "How long does it take to get my dating app data?",
    answer:
      "It depends on the platform, but usually you should receive your data within 48 hours of requesting it. Have patience:)",
  },
  {
    question: "How do I upload my data to SwipeStats.io?",
    answer:
      "To upload your data, you need to request your Tinder data file, download it once it's provided by Tinder, and then submit the anonymized data on SwipeStats.io without unzipping it.",
    cta: "Upload your data now.",
  },
  {
    question:
      "What if I forget to come back to SwipeStats.io after receiving my data from Tinder?",
    answer:
      "You can enter your email on SwipeStats.io to receive a reminder in 3 days, ensuring you don't forget to use the service.",
  },
  {
    question: "How much of my dating app history can I see with Swipestats?",
    answer:
      "The entire time that you have had an active Tinder account, even if you started in 2012 when Tinder was launched.",
  },
  {
    question: "Can I see my entire history if I previously deleted my account?",
    answer: `That depends on how long it has been deleted for and whether it was closed or banned. 

      Tinder keeps your data for 3 months if your account was deleted and 12 months if it was banned. So if your account was deleted for shorter than 3 months, you can see your entire history.
      
      Note that “deleting” means that you completely delete the account, not just removing the app from your phone or desktop.`,
  },
  {
    question: "Is using Swipestats free?",
    answer:
      "Getting your data visualized and comparing yourself to a bigger general demographic is completely free. If you want to do an in-depth comparison or request a dataset, there is a free.",
    cta: "Check prices.",
  },
  {
    question:
      "Does Swipestats work with data from other dating apps like Bumble or Hinge?",
    answer: "Not yet, but it's coming soon!",
  },
  {
    question: "How often can I upload new data for analysis?",
    answer:
      "Anytime you like! Every time you upload, you'll be able to compare to your own previous data.",
  },
  {
    question: "How can I request my Tinder data?",
    answer: `Simple go https://account.gotinder.com/data to and follow the steps!`,
  },
  // More questions...
];

export function FAQ() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-6 py-24 lg:max-w-7xl lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function FAQ2() {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
      <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
        Frequently asked questions
      </h2>
      <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
          >
            <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
              {faq.question}
            </dt>
            <dd className="mt-4 lg:col-span-7 lg:mt-0">
              <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
