import { Button, Section, Text } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";

const DatasetPurchaseEmail = (params: {
  customerEmail: string;
  customerName?: string;
  datasetName: string;
  downloadLink: string;
}) => {
  return (
    <BaseEmailLayout>
      <Section className="text-center">
        <Text className="text-2xl font-bold text-gray-800">
          Thank you for your purchase,{" "}
          {params.customerName ? params.customerName : "valued researcher"}!
        </Text>
      </Section>

      <Section className="mt-6">
        <Text className="text-gray-700">
          We&apos;re excited to confirm your purchase of the{" "}
          {params.datasetName} research dataset.
        </Text>
      </Section>

      <Section className="mt-8">
        <Text className="font-semibold text-gray-800">Next steps:</Text>
        <Text className="mt-2 text-gray-700">
          1. Download your dataset using the secure link below.
        </Text>
        <Button
          href={
            // params.downloadLink
            "https://drive.google.com/drive/folders/1TbczEde5nPYbYK_VHPjc3y8rSNNKkt56?usp=sharing"
          }
          className="mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2"
        >
          Download Your Dataset
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          2. Explore our documentation to make the most of your new dataset.
        </Text>
        <Button
          href="https://github.com/kristianeboe/swipestats.io/blob/main/prisma/schema.prisma"
          className="bg-swipestats-primary hover:bg-swipestats-primary/90 focus-visible:ring-swipestats-primary mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          View Dataset Documentation
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          If you have any questions about the dataset or need assistance,
          don&apos;t hesitate to reply to this email or contact our research
          support team.
        </Text>
      </Section>

      <Section className="mt-8 text-center">
        <Text className="text-sm text-gray-600">
          We&apos;re excited to see the insights you&apos;ll uncover with this
          dataset!
        </Text>
      </Section>
    </BaseEmailLayout>
  );
};

DatasetPurchaseEmail.subject = ({}) => `Your dataset is ready to download!`;

DatasetPurchaseEmail.PreviewProps = {
  customerEmail: "researcher@example.com",
  customerName: "Dr. Smith",
  datasetName: "Full Package",
  downloadLink: "https://swipestats.io/download/dataset/123456",
};

export default DatasetPurchaseEmail;
