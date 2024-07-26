import { Button, Section, Text } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";

const AiPhotosPurchaseEmail = (params: {
  customerEmail: string;
  customerName?: string;
  googleDriveFolderUrl: string;
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
          We're excited to confirm your purchase of AI Dating Photos. Your
          journey to better dating profile pictures starts now!
        </Text>
      </Section>

      <Section className="mt-8">
        <Text className="font-semibold text-gray-800">Next steps:</Text>
        <Text className="mt-2 text-gray-700">
          1. Upload your photos to our secure Google Drive folder for AI
          enhancement.
        </Text>
        <Button
          href={params.googleDriveFolderUrl}
          className="mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-rose-50 transition-colors hover:bg-rose-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-950 focus-visible:ring-offset-2"
        >
          Upload your Photos to our Google Drive
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          2. While we work on your photos, why not gain more insights into your
          dating profile?
        </Text>
        <Button
          href="https://swipestats.io/upload/tinder"
          className="bg-swipestats-primary hover:bg-swipestats-primary/90 focus-visible:ring-swipestats-primary mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Upload Your Tinder Data for Insights
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          If you have any questions or need assistance, don't hesitate to reply
          to this email or contact our support team.
        </Text>
      </Section>

      <Section className="mt-8 text-center">
        <Text className="text-sm text-gray-600">
          We can't wait to see your enhanced dating profile pictures!
        </Text>
      </Section>
    </BaseEmailLayout>
  );
};

AiPhotosPurchaseEmail.PreviewProps = {
  customerEmail: "test@test.com",
  customerName: "John",
  googleDriveFolderUrl:
    "https://drive.google.com/drive/folders/1GGGDgg96Vjaxrk5jej7bBC_z2p4lbwqi",
};

export default AiPhotosPurchaseEmail;
