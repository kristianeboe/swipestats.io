import { Button, Column, Link, Section } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";

const AiPhotosPurchaseEmail = (params: {
  customerEmail: string;
  customerName?: string;
  googleDriveFolderUrl: string;
}) => {
  return (
    <BaseEmailLayout>
      <Section className="flex justify-center">
        Thanks {params.customerName ? params.customerName : "Bro"}
      </Section>
      <Section className="mt-10 flex justify-center">
        <Button
          className="mx-auto inline-flex h-10 w-96 items-center justify-center whitespace-nowrap rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-rose-50 ring-offset-white transition-colors hover:bg-rose-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-rose-950 dark:focus-visible:ring-rose-300"
          href={params.googleDriveFolderUrl}
        >
          Upload your Photos to our Google Drive
        </Button>
      </Section>
    </BaseEmailLayout>
  );
};

AiPhotosPurchaseEmail.PreviewProps = {
  customerEmail: "test@test.com",
  customerName: "Bro",
  googleDriveFolderUrl:
    "https://drive.google.com/drive/folders/1GGGDgg96Vjaxrk5jej7bBC_z2p4lbwqi",
};

export default AiPhotosPurchaseEmail;
