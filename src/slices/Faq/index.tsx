"use client";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";

/**
 * Props for `Faqs`.
 */
export type FaqsProps = SliceComponentProps<Content.FaqsSlice>;

/**
 * Component for "Faqs" Slices.
 */
const Faqs = ({ slice }: FaqsProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            <dl className="mt-10 space-y-6">
              {slice.primary.questions_and_answers.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question!}
                  className="pt-6"
                  onClick={() =>
                    analyticsTrackClient("FAQ Question Clicked", {
                      question: faq.question,
                    })
                  }
                >
                  <dt>
                    <AccordionTrigger className="group flex w-full items-start justify-between text-left text-gray-900">
                      <span className="text-base font-semibold leading-7">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                  </dt>

                  <dd>
                    <AccordionContent className="prose mt-2 pr-12 text-gray-600">
                      <PrismicRichText field={faq.answer} />
                    </AccordionContent>
                  </dd>
                </AccordionItem>
              ))}
            </dl>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
