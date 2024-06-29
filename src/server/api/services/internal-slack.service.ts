import { env } from "@/env";

const channels = {
  "bot-messages": env.SLACK_WEBHOOK_INTERNAL,
};

type SlackMessageBody = Record<
  string,
  string | number | boolean | Date | null | undefined
>;
function formatSlackMessage(data: SlackMessageBody): string {
  let formattedMessage = "";
  Object.entries(data).forEach(([key, value]) => {
    if (value === null) {
      formattedMessage = `${key}: null\n`;
    } else if (value === undefined) {
      formattedMessage = `${key}: undefined\n`;
    } else {
      formattedMessage += `${key}: ${value.toString()}\n`;
    }
  });
  formattedMessage += `Environment ` + env.NEXT_PUBLIC_MANUAL_ENV;

  return formattedMessage;
}

export function sendInternalSlackError(params: {
  message: string;
  error: unknown;
  extraProperties?: Record<string, unknown>;
}) {
  return sendInternalSlackMessage("bot-messages", "Error", {
    message: params.message,
    logs: `https://logs.betterstack.com/team/280264/tail?rf=now-30m&a=${Date.now() + "000"}`, // todo replace with vouch
    error: JSON.stringify(
      params.error,
      Object.getOwnPropertyNames(params.error),
    ),
    ...(params.extraProperties && {
      extraProperties: JSON.stringify(params.extraProperties, null, 2),
    }),
  });
}

export function sendInternalSlackMessage(
  to: keyof typeof channels,
  title: string,
  body: SlackMessageBody,
) {
  // if (env.NEXT_PUBLIC_MANUAL_ENV !== "production") return;

  const textMessage = formatSlackMessage(body);
  console.log("Sending slack message", textMessage);
  try {
    void fetch(channels[to], {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text: `${title}\n${textMessage}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send slack message", textMessage, error);
  }
}
