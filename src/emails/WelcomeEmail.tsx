import React from "react";
import { Text, Button } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";
import TestimonialEmail from "./TestimonialEmail";

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <BaseEmailLayout>
      <Text>Hello {username},</Text>
      <Text>
        Welcome to Swipestats.io! We&apos;re excited to help you gain insights
        into your dating app usage.
      </Text>
      <Text>
        To get started, simply connect your dating app accounts and explore your
        personalized statistics.
      </Text>
      <Button
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-rose-50 ring-offset-white transition-colors hover:bg-rose-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-rose-950 dark:focus-visible:ring-rose-300"
        href="https://swipestats.io/dashboard"
      >
        Upload your Photos to our Google Drive
      </Button>
      <TestimonialEmail />
    </BaseEmailLayout>
  );
}
