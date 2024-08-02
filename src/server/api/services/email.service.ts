import AiPhotosPurchaseEmail from "@/emails/AiPhotosPurchaseEmail";
import DatasetPurchaseEmail from "@/emails/DatasetPurchaseEmail";
import { env } from "@/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const emails = {
  aiPhotosPurchase: {
    subject: "Time to upload your photos!",
    template: AiPhotosPurchaseEmail,
  },
  datasetPurchase: {
    subject: "Your dataset is ready to download!",
    template: DatasetPurchaseEmail,
  },
} as const;

export async function sendReactEmail<T extends Record<string, string>>(
  reactEmail: (params: T) => JSX.Element,
  templateData: T,
  params: {
    subject: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
  },
) {
  return await resend.emails.send({
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    from: params.from ?? "kris@swipestats.io",
    subject: params.subject,
    react: reactEmail(templateData),
    text: "", // Add a default empty string for the 'text' field // TODO investigate if this is needed
  });
}
