import AiPhotosPurchaseEmail from "@/emails/AiPhotosPurchaseEmail";
import { env } from "@/env";

import { Resend } from "resend";
const resend = new Resend(env.RESEND_API_KEY);

const emails = {
  aiPhotosPurchase: {
    subject: "Time to upload your photos!",
    template: AiPhotosPurchaseEmail,
  },
} as const;

export async function sendDynamicEmail<T extends keyof typeof emails>(params: {
  to: string | string[];
  template: T;
  templateData: Parameters<(typeof emails)[T]["template"]>[0];
  from?: string;
}) {
  const { to, template, templateData, from } = params;
  const emailConfig = emails[template];

  return await resend.emails.send({
    from: from ?? "kris@swipestats.io",
    to: Array.isArray(to) ? to : [to],
    subject: emailConfig.subject,
    react: emailConfig.template(templateData),
  });
}
