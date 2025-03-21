import { env } from "@/env";
import { waitUntil } from "@vercel/functions";

const channels = {
  "bot-messages": env.SLACK_WEBHOOK_INTERNAL,
  "ai-photos": env.SLACK_WEBHOOK_INTERNAL_AI_MESSAGES,
  "bot-developer": env.SLACK_WEBHOOK_INTERNAL_DEVELOPER,
  sales: env.SLACK_WEBHOOK_INTERNAL_SALES,
  "rich-message-test": env.SLACK_WEBHOOK_INTERNAL_RICH_MESSAGE_TEST,
} as const;

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

export async function sendInternalSlackError(params: {
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
  try {
    const blocks: Block[] = [
      createHeaderBlock(title),
      createRichTextBlock([
        createRichTextSection([
          ...Object.entries(body)
            .map(([key, value]) => {
              const elements: RichTextElement[] = [
                createTextElement(`${key}: `),
              ];

              const valueStr = value?.toString() ?? "null";
              // Check if value is a URL
              if (
                typeof value === "string" &&
                (value.startsWith("http://") || value.startsWith("https://"))
              ) {
                elements.push(createLinkElement(valueStr, valueStr));
              } else {
                elements.push(createTextElement(valueStr));
              }

              elements.push(createTextElement("\n"));
              return elements;
            })
            .flat(),
        ]),
      ]),
      createDividerBlock(),
      createContextBlock(`Environment: ${env.NEXT_PUBLIC_MANUAL_ENV}`),
    ];

    sendRichSlackMessage(to, blocks);
  } catch (error) {
    console.error("Failed to send rich slack message:", error);
    // Fallback to simple message if rich message fails
    waitUntil(
      fetch(channels[to], {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          text: `${title}\n${formatSlackMessage(body)}`,
        }),
      }),
    );
  }
}

// Block Kit Types

type TextStyle = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
};

type TextElement = {
  type: "text";
  text: string;
  style?: TextStyle;
};

type EmojiElement = {
  type: "emoji";
  name: string;
};

type LinkElement = {
  type: "link";
  text: string;
  url: string;
  style?: TextStyle;
};

type UserElement = {
  type: "user";
  user_id: string;
};

type ChannelElement = {
  type: "channel";
  channel_id: string;
};

type RichTextElement =
  | TextElement
  | EmojiElement
  | LinkElement
  | UserElement
  | ChannelElement;

type RichTextSection = {
  type: "rich_text_section";
  elements: RichTextElement[];
};

type RichTextListItem = {
  type: "rich_text_section";
  elements: RichTextElement[];
};

type RichTextList = {
  type: "rich_text_list";
  style: "bullet" | "ordered";
  elements: RichTextListItem[];
  indent?: number;
};

type RichTextQuote = {
  type: "rich_text_quote";
  elements: RichTextElement[];
};

type PlainText = {
  type: "plain_text";
  text: string;
  emoji?: boolean;
};

type MrkdwnText = {
  type: "mrkdwn";
  text: string;
  verbatim?: boolean;
};

type TextObject = PlainText | MrkdwnText;

type HeaderBlock = {
  type: "header";
  text: PlainText;
};

type ContextElement =
  | {
      type: "image";
      image_url: string;
      alt_text: string;
    }
  | MrkdwnText
  | PlainText;

type ContextBlock = {
  type: "context";
  elements: ContextElement[];
};

type ImageAccessory = {
  type: "image";
  image_url: string;
  alt_text: string;
};

type SectionBlock = {
  type: "section";
  text: TextObject;
  accessory?: ImageAccessory;
};

type DividerBlock = {
  type: "divider";
};

type RichTextBlock = {
  type: "rich_text";
  elements: (RichTextSection | RichTextList | RichTextQuote)[];
};

type InputElement = {
  type: "plain_text_input";
  action_id: string;
  placeholder?: PlainText;
};

type InputBlock = {
  type: "input";
  block_id: string;
  element: InputElement;
  label: PlainText;
};

type ButtonElement = {
  type: "button";
  text: PlainText;
  action_id: string;
  url?: string;
  value?: string;
  style?: "primary" | "danger";
};

type ActionsBlock = {
  type: "actions";
  block_id: string;
  elements: ButtonElement[];
};

type Block =
  | HeaderBlock
  | ContextBlock
  | SectionBlock
  | DividerBlock
  | RichTextBlock
  | InputBlock
  | ActionsBlock;

type RichSlackMessage = {
  blocks: Block[];
};

// Rich Slack Message Functions

/**
 * Creates a text element for use in rich text blocks
 */
function createTextElement(text: string, style?: TextStyle): TextElement {
  return {
    type: "text",
    text,
    ...(style && { style }),
  };
}

/**
 * Creates an emoji element for use in rich text blocks
 */
function createEmojiElement(name: string): EmojiElement {
  return {
    type: "emoji",
    name,
  };
}

/**
 * Creates a link element for use in rich text blocks
 */
function createLinkElement(
  text: string,
  url: string,
  style?: TextStyle,
): LinkElement {
  return {
    type: "link",
    text,
    url,
    ...(style && { style }),
  };
}

/**
 * Creates a rich text section with multiple elements
 */
function createRichTextSection(elements: RichTextElement[]): RichTextSection {
  return {
    type: "rich_text_section",
    elements,
  };
}

/**
 * Creates a bulleted or ordered list
 */
function createRichTextList(
  listItems: RichTextElement[][],
  style: "bullet" | "ordered" = "bullet",
  indent?: number,
): RichTextList {
  return {
    type: "rich_text_list",
    style,
    elements: listItems.map((item) => ({
      type: "rich_text_section",
      elements: item,
    })),
    ...(indent !== undefined && { indent }),
  };
}

/**
 * Creates a quote block
 */
function createRichTextQuote(elements: RichTextElement[]): RichTextQuote {
  return {
    type: "rich_text_quote",
    elements,
  };
}

/**
 * Creates a header block
 */
function createHeaderBlock(text: string): HeaderBlock {
  return {
    type: "header",
    text: {
      type: "plain_text",
      text,
    },
  };
}

/**
 * Creates a context block with text
 */
function createContextBlock(text: string): ContextBlock {
  return {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text,
      },
    ],
  };
}

/**
 * Creates a section block with optional image
 */
function createSectionBlock(
  text: string,
  imageUrl?: string,
  altText?: string,
): SectionBlock {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
    ...(imageUrl &&
      altText && {
        accessory: {
          type: "image",
          image_url: imageUrl,
          alt_text: altText,
        },
      }),
  };
}

/**
 * Creates a divider block
 */
function createDividerBlock(): DividerBlock {
  return {
    type: "divider",
  };
}

/**
 * Creates a rich text block
 */
function createRichTextBlock(
  elements: (RichTextSection | RichTextList | RichTextQuote)[],
): RichTextBlock {
  return {
    type: "rich_text",
    elements,
  };
}

/**
 * Creates a button element
 */
function createButtonElement(
  text: string,
  actionId: string,
  url?: string,
  value?: string,
  style?: "primary" | "danger",
): ButtonElement {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text,
    },
    action_id: actionId,
    ...(url && { url }),
    ...(value && { value }),
    ...(style && { style }),
  };
}

/**
 * Creates an actions block with buttons
 */
function createActionsBlock(
  blockId: string,
  buttons: ButtonElement[],
): ActionsBlock {
  return {
    type: "actions",
    block_id: blockId,
    elements: buttons,
  };
}

/**
 * Sends a rich formatted Slack message
 */
export function sendRichSlackMessage(
  to: keyof typeof channels,
  blocks: Block[],
) {
  console.log("Sending rich slack message", JSON.stringify(blocks, null, 2));
  waitUntil(
    fetch(channels[to], {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        blocks,
      }),
    }),
  );
}

/**
 * Sends an error message using rich formatting
 */
export function sendRichSlackError(params: {
  message: string;
  error: unknown;
  extraProperties?: Record<string, unknown>;
}) {
  const errorString = JSON.stringify(
    params.error,
    Object.getOwnPropertyNames(params.error),
  );

  const blocks: Block[] = [
    createHeaderBlock("Error"),
    createContextBlock(`Environment: ${env.NEXT_PUBLIC_MANUAL_ENV}`),
    createSectionBlock(params.message),
    createDividerBlock(),
    createRichTextBlock([
      createRichTextSection([
        createTextElement("Error Details", { bold: true }),
      ]),
      createRichTextQuote([createTextElement(errorString)]),
    ]),
  ];

  if (params.extraProperties) {
    blocks.push(
      createDividerBlock(),
      createRichTextBlock([
        createRichTextSection([
          createTextElement("Extra Properties", { bold: true }),
        ]),
        createRichTextQuote([
          createTextElement(JSON.stringify(params.extraProperties, null, 2)),
        ]),
      ]),
    );
  }

  // Add logs link
  blocks.push(
    createDividerBlock(),
    createSectionBlock("View Logs"),
    createActionsBlock("view_logs", [
      createButtonElement(
        "View Logs",
        "view_logs",
        `https://logs.betterstack.com/team/280264/tail?rf=now-30m&a=${Date.now() + "000"}`,
        undefined,
        "primary",
      ),
    ]),
  );

  return sendRichSlackMessage("bot-messages", blocks);
}

/**
 * Creates an onboarding message with rich formatting
 */
export function sendOnboardingMessage(
  to: keyof typeof channels,
  week: number,
  additionalResources: Array<{ title: string; url: string }> = [],
) {
  const blocks: Block[] = [
    createHeaderBlock(`Onboarding Week ${week}`),
    createContextBlock(
      "Hello there! This is a weekly reminder of what you should be doing during onboarding.",
    ),
    createSectionBlock(
      "Welcome aboard!\n :eye: :lips: :eye:\n\nHere are some things you should do in week 1.\nOf course, reach out to your manager with any questions.",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmJnd2x5bHJ2eDViZW83Z28wZzRldzIyOHRybmx0NHd5MnhmcXdvYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dzaUX7CAG0Ihi/giphy.gif",
      "Welcome image",
    ),
    createDividerBlock(),
  ];

  // Company business section
  blocks.push(
    createRichTextBlock([
      createRichTextSection([
        createEmojiElement("office"),
        createTextElement(" Company business", { bold: true }),
      ]),
      createRichTextList(
        [
          [createTextElement("Fill out your W-2")],
          [
            createTextElement("Enroll in "),
            createLinkElement("benefits", "https://benefits.company.com"),
          ],
          [createTextElement("Fill out your Slack profile, including:")],
        ],
        "bullet",
      ),
      createRichTextList(
        [[createTextElement("Time zone")], [createTextElement("Pronouns")]],
        "ordered",
        1,
      ),
    ]),
  );

  blocks.push(createDividerBlock());

  // Culture resources section
  blocks.push(
    createRichTextBlock([
      createRichTextSection([
        createEmojiElement("green_book"),
        createTextElement(" Read about our culture", { bold: true }),
      ]),
      createRichTextList(
        additionalResources.map((resource) => [
          createLinkElement(resource.title, resource.url),
        ]),
        "bullet",
      ),
    ]),
  );

  blocks.push(createDividerBlock());

  // Inspirational quote
  blocks.push(
    createRichTextBlock([
      createRichTextSection([
        createEmojiElement("speech_balloon"),
        createTextElement(" Inspirational quote of the day", { bold: true }),
      ]),
      createRichTextQuote([
        createTextElement("Having no destination I am never lost. - Ikkyu."),
      ]),
    ]),
  );

  // Input for user's favorite quote
  blocks.push({
    type: "input",
    block_id: "quote_input",
    element: {
      type: "plain_text_input",
      action_id: "quote_input",
      placeholder: {
        type: "plain_text",
        text: "Write something",
      },
    },
    label: {
      type: "plain_text",
      text: "Enter your favorite quote, to be shared with future hires like you:",
    },
  });

  // Submit button
  blocks.push(
    createActionsBlock("quote_submit", [
      createButtonElement("Submit", "submit_quote"),
    ]),
  );

  return sendRichSlackMessage(to, blocks);
}
