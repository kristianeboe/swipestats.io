import { Button, Section, Text } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";

const ComparisonDataPurchaseConfirmation = (params: {
  customerEmail: string;
  customerName?: string;
  comparisonUrl: string;
}) => {
  return (
    <BaseEmailLayout>
      <Section className="text-center">
        <Text className="text-2xl font-bold text-gray-800">
          Thank you for your purchase,{" "}
          {params.customerName ? params.customerName : "valued customer"}!
        </Text>
      </Section>

      <Section className="mt-6">
        <Text className="text-gray-700">
          We&apos;re excited to confirm your purchase of the Comparison Data
          feature. Get ready to gain valuable insights into your dating profile
          performance!
        </Text>
      </Section>

      <Button
        href={params.comparisonUrl}
        className="bg-swipestats-primary hover:bg-swipestats-primary/90 focus-visible:ring-swipestats-primary mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        View Your Comparison Data
      </Button>

      <Section className="mt-8 text-center">
        <Text className="text-sm text-gray-600">
          We hope this data helps you optimize your dating profile and improve
          your matches!
        </Text>
      </Section>
    </BaseEmailLayout>
  );
};

ComparisonDataPurchaseConfirmation.PreviewProps = {
  customerEmail: "test@test.com",
  customerName: "John",
  comparisonUrl: "https://swipestats.io/comparison/abc123",
};

export default ComparisonDataPurchaseConfirmation;
