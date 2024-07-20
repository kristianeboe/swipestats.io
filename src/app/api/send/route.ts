import { EmailTemplate } from "@/app/_components/email-templates/BaseEmailTemplate";
import GooglePlayPolicyUpdateEmail from "@/emails/google-play-policy-update";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { env } from "@/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello world",
      react: WelcomeEmail({
        username: "kristianeboe",
      }), // EmailTemplate({ firstName: "John" }),
      text: "Backup text I assume",
      // headers: {
      //   'List-Unsubscribe': '<https://example.com/unsubscribe>',
      // },
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
