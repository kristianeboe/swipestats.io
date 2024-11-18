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
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  experienceRating: z.number().min(1).max(5).nullable(),
  howDoTheResultsMakeYouFeel: z
    .enum(["happy", "sad", "neutral", "surprised", "disheartened"])
    .array(),
  // whichProductsWouldYouLikeToSee: z
  //   .enum([
  //     "more charts and stats",
  //     "comparisons",
  //     "AI photos",
  //     "dating tips",
  //     "hinge insights",
  //     "bumble insights",
  //   ])
  //   .array(),
  // wouldYouRecommend: z.enum(["yes", "no", "maybe"]).nullish(),
  // otherTextFeedback: z.string(),
});

export function UserFeedback({ tinderId }: { tinderId: string }) {
  const [feedbackSubmittedLocal, setFeedbackSubmittedLocal] = useLocalStorage(
    "feedbackSubmitted",
    false,
  );

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setFeedbackSubmitted(feedbackSubmittedLocal);
  }, [feedbackSubmittedLocal]);

  const submitFeedbackMutation = api.misc.submitFeedback.useMutation({
    onSuccess: () => {
      setFeedbackSubmittedLocal(true);
      toast.success("Feedback submitted");
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      experienceRating: null,
      howDoTheResultsMakeYouFeel: [],
      // whichProductsWouldYouLikeToSee: [],
      // wouldYouRecommend: null,
      // otherTextFeedback: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    submitFeedbackMutation.mutate({
      ...values,
      tinderId: tinderId,
    });
  };

  if (feedbackSubmitted) {
    return (
      <Card.Container className="w-full flex-shrink-0 xl:max-w-md">
        <Card.Header>
          <div className="mb-4 flex items-center justify-center">
            <CheckCircleIcon className="text-primary h-16 w-16" />
          </div>
          <Card.Title className="text-center text-2xl sm:text-3xl">
            Thank You for Your Feedback!
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-muted-foreground text-center">
            We appreciate you taking the time to share your thoughts with us.
            Your feedback is invaluable in helping us improve Swipestats.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-center"></Card.Footer>
      </Card.Container>
    );
  }

  return (
    <Card.Container className="w-full flex-shrink-0 xl:max-w-md">
      <Card.Header>
        <Card.Title>How is your experience with Swipestats?</Card.Title>
        <Card.Description>
          Please take a moment to provide your feedback.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="mb-4 grid gap-4">
              <StarRatingFormField
                label="How would you rate your overall experience?"
                name="experienceRating"
                options={[1, 2, 3, 4, 5]}
              />

              <div className="grid gap-2">
                <TagGroupFormField
                  label="How do the results make you feel?"
                  name="howDoTheResultsMakeYouFeel"
                  options={[
                    { label: "Happy", value: "happy" },
                    { label: "Sad", value: "sad" },
                    { label: "Neutral", value: "neutral" },
                    { label: "Surprised", value: "surprised" },
                    { label: "Disheartened", value: "disheartened" },
                  ]}
                />
              </div>

              {/* Recommend */}
              {/* <div className="space-y-2">
                <Label htmlFor="recommend">
                  Would you recommend us to a friend?
                </Label>
                <RadioGroup
                  id="recommend"
                  name="recommend"
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="recommend-yes" />
                    <Label htmlFor="recommend-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="recommend-no" />
                    <Label htmlFor="recommend-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="recommend-maybe" />
                    <Label htmlFor="recommend-maybe">Maybe</Label>
                  </div>
                </RadioGroup>
              </div> */}

              {/* <div className="grid gap-2">
                <Label htmlFor="feedback">How can we improve?</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts on how we can make Swipestats better..."
                />
              </div> */}
            </div>
            <div className="flex">
              <Button loading={submitFeedbackMutation.isPending}>
                Submit Feedback
              </Button>
            </div>
          </form>
        </Form>
      </Card.Content>
    </Card.Container>
  );
}
