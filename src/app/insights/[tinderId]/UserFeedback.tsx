"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cflNFwK3lne
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { Form } from "@/app/_components/ui/form";
import {
  RadioGroupFormField,
  StarRatingFormField,
} from "@/app/_components/ui/formFields/RadioGroupFormField";
import { TagGroupFormField } from "@/app/_components/ui/formFields/TagGroupFormField";
import { Label } from "@/app/_components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Textarea } from "@/app/_components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  starRating: z.number().min(1).max(5).nullish(),
  howDoTheResultsMakeYouFeel: z
    .enum(["happy", "sad", "neutral", "surprised", "disheartened"])
    .array(),
  whichProductsWouldYouLikeToSee: z
    .enum([
      "more charts and stats",
      "more comparisons",
      "AI photos",
      "dating tips",
    ])
    .array(),
  wouldYouRecommend: z.enum(["yes", "no", "maybe"]).nullish(),
  otherTextFeedback: z.string(),
});

export function UserFeedback() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      starRating: null,
      howDoTheResultsMakeYouFeel: [],
      whichProductsWouldYouLikeToSee: [],
      wouldYouRecommend: null,
      otherTextFeedback: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values);
  };

  return (
    <Card.Container>
      <Card.Header>
        <Card.Title>How is your experience with Swipestats?</Card.Title>
        <Card.Description>
          Please take a moment to provide your feedback.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <StarRatingFormField
              label="How would you rate your experience with Swipestats?"
              name="starRating"
              options={[1, 2, 3, 4, 5]}
            />
            <div className="flex">
              <div className="flex items-center gap-2">
                <RadioGroupFormField
                  label="Radio was your experience?"
                  name="starRating"
                  options={[
                    { label: "", value: "1" },
                    { label: "", value: "2" },
                    { label: "", value: "3" },
                    { label: "", value: "4" },
                    { label: "", value: "5" },
                  ]}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="helpful">Was our service helpful?</Label>
                {/* <RadioGroup id="helpful" defaultValue="maybe">
                  <div className="flex flex-wrap gap-2">
                    <Label
                      htmlFor="helpful-yes"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="helpful-yes"
                        value="yes"
                        className="sr-only"
                      />
                      Yes
                    </Label>
                    <Label
                      htmlFor="helpful-no"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="helpful-no"
                        value="no"
                        className="sr-only"
                      />
                      No
                    </Label>
                    <Label
                      htmlFor="helpful-maybe"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="helpful-maybe"
                        value="maybe"
                        className="sr-only"
                      />
                      Maybe
                    </Label>
                  </div>
                </RadioGroup> */}
              </div>
              <div className="grid gap-2">
                {/* <TagGroupFormField
                  label="How do the results make you feel?"
                  name="howDoTheResultsMakeYouFeel"
                  options={[
                    { label: "Happy", value: "happy" },
                    { label: "Sad", value: "sad" },
                    { label: "Neutral", value: "neutral" },
                    { label: "Surprised", value: "surprised" },
                    { label: "Disheartened", value: "disheartened" },
                  ]}
                /> */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recommend">
                  Would you recommend us to a friend?
                </Label>
                {/* <RadioGroup id="recommend" defaultValue="maybe">
                  <div className="flex flex-wrap gap-2">
                    <Label
                      htmlFor="recommend-yes"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="recommend-yes"
                        value="yes"
                        className="sr-only"
                      />
                      Yes
                    </Label>
                    <Label
                      htmlFor="recommend-no"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="recommend-no"
                        value="no"
                        className="sr-only"
                      />
                      No
                    </Label>
                    <Label
                      htmlFor="recommend-maybe"
                      className="bg-primary text-primary-foreground cursor-pointer rounded-full px-3 py-1"
                    >
                      <RadioGroupItem
                        id="recommend-maybe"
                        value="maybe"
                        className="sr-only"
                      />
                      Maybe
                    </Label>
                  </div>
                </RadioGroup> */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">How can we improve?</Label>
                {/* <Textarea id="feedback" placeholder="Enter your feedback" /> */}
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Submit Feedback</Button>
            </div>
          </form>
        </Form>
      </Card.Content>
    </Card.Container>
  );
}
