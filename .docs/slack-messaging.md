# Slack Rich Text Messaging

## Introduction to Block Kit

Block Kit is a UI framework for Slack apps that enables you to create visually appealing, interactive messages. It consists of three main components:

- **Blocks**: Visual components that can be arranged to create app layouts
- **Block Elements**: Interactive components like buttons and menus
- **Composition Objects**: Define text, options, or other features within blocks and elements

Block Kit can be used across all app surfaces: Home tabs, messages, and modals.

## Block Types

The main blocks available for rich text messaging include:

- **header**: Large title text (plain_text only)
- **context**: Smaller, lighter text providing context
- **section**: Text with optional accessory image
- **divider**: Horizontal line separator
- **rich_text**: Formatted text with multiple styling options
- **input**: Component for text data collection
- **actions**: Interactive elements like buttons

## Rich Text Elements

Within a `rich_text` block, you can use various elements:

- **rich_text_section**: A single line of text that can contain multiple elements
- **rich_text_list**: Bulleted or ordered lists
- **rich_text_quote**: Formatted quote with a vertical bar

## Text Styling Options

Text can be styled with:

- **bold**
- **italic**
- **strike**
- **code**

## Element Types

The following element types can be used within rich text sections:

- text
- link
- emoji
- user
- user_group
- channel

## Nested Lists

Create nested lists by setting the `indent` property:

- Main item
  - Indented item (indent: 1)
    - Further indented item (indent: 2)

## Example: Onboarding Message

Let's break down how to create an onboarding message with rich formatting like the one shown in the example:

<!-- Note: The actual onboarding message would appear here in the documentation -->

### Header Component

```json
{
  "type": "header",
  "text": {
    "type": "plain_text",
    "text": "Onboarding Week 1"
  }
}
```

The header block provides large title text. Note that it only supports `plain_text` format.

### Context Component

```json
{
  "type": "context",
  "elements": [
    {
      "type": "mrkdwn",
      "text": "Hello there! This is a weekly reminder of what you should be doing during onboarding."
    }
  ]
}
```

The context block renders smaller, lighter text providing additional information.

### Welcome Section with Image

```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Welcome aboard!\n :eye: :lips: :eye:\n\nHere are some things you should do in week 1.\nOf course, reach out to your manager with any questions."
  },
  "accessory": {
    "type": "image",
    "image_url": "https://media.giphy.com/media/example/onboarding.gif",
    "alt_text": "Welcome image"
  }
}
```

This section combines text with an accessory image, allowing side-by-side display.

### Divider Component

```json
{
  "type": "divider"
}
```

A simple horizontal line to separate content sections.

### Company Business Section

```json
{
  "type": "rich_text",
  "elements": [
    {
      "type": "rich_text_section",
      "elements": [
        {
          "type": "emoji",
          "name": "office"
        },
        {
          "type": "text",
          "text": " Company business",
          "style": {
            "bold": true
          }
        }
      ]
    },
    {
      "type": "rich_text_list",
      "style": "bullet",
      "elements": [
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "text",
              "text": "Fill out your W-2"
            }
          ]
        },
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "text",
              "text": "Enroll in "
            },
            {
              "type": "link",
              "text": "benefits",
              "url": "https://salesforcebenefits.com"
            }
          ]
        },
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "text",
              "text": "Fill out your Slack profile, including:"
            }
          ]
        }
      ]
    },
    {
      "type": "rich_text_list",
      "style": "ordered",
      "indent": 1,
      "elements": [
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "text",
              "text": "Time zone"
            }
          ]
        },
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "text",
              "text": "Pronouns"
            }
          ]
        }
      ]
    }
  ]
}
```

This block demonstrates:

- Using emoji with text in a section header
- Creating a bulleted list
- Inline linking of text ("benefits")
- Creating a nested, ordered list with indent: 1

### Culture Resources Section

```json
{
  "type": "rich_text",
  "elements": [
    {
      "type": "rich_text_section",
      "elements": [
        {
          "type": "emoji",
          "name": "green_book"
        },
        {
          "type": "text",
          "text": " Read about our culture",
          "style": {
            "bold": true
          }
        }
      ]
    },
    {
      "type": "rich_text_list",
      "style": "bullet",
      "elements": [
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "link",
              "text": "Four tips for building a digital first culture",
              "url": "https://slack.com/blog/collaboration/four-tips-build-digital-first-culture"
            }
          ]
        },
        {
          "type": "rich_text_section",
          "elements": [
            {
              "type": "link",
              "text": "6 simple ways to foster a positive hybrid work environment",
              "url": "https://slack.com/blog/collaboration/ways-foster-positive-work-environment"
            }
          ]
        }
      ]
    }
  ]
}
```

This section shows:

- Another heading with emoji
- A bulleted list where each item is a full link

### Quote of the Day Section

```json
{
  "type": "rich_text",
  "elements": [
    {
      "type": "rich_text_section",
      "elements": [
        {
          "type": "emoji",
          "name": "speech_balloon"
        },
        {
          "type": "text",
          "text": " Inspirational quote of the day",
          "style": {
            "bold": true
          }
        }
      ]
    },
    {
      "type": "rich_text_quote",
      "elements": [
        {
          "type": "text",
          "text": "Having no destination I am never lost. - Ikkyu."
        }
      ]
    }
  ]
}
```

This demonstrates using the quote formatting with the `rich_text_quote` element.

### Input Component

```json
{
  "type": "input",
  "block_id": "quote_input",
  "element": {
    "type": "plain_text_input",
    "action_id": "quote_input",
    "placeholder": {
      "type": "plain_text",
      "text": "Write something"
    }
  },
  "label": {
    "type": "plain_text",
    "text": "Enter your favorite quote, to be shared with future hires like you:"
  }
}
```

This input block allows users to enter their own quote.

### Submit Button

```json
{
  "type": "actions",
  "block_id": "quote_submit",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Submit"
      },
      "action_id": "submit_quote"
    }
  ]
}
```

The actions block with a Submit button allows users to submit their input.

## Putting It All Together

To create the complete onboarding message, combine all blocks in a JSON array:

```json
[
  {
    "type": "header",
    "text": {
      "type": "plain_text",
      "text": "Onboarding Week 1"
    }
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "Hello there! This is a weekly reminder of what you should be doing during onboarding."
      }
    ]
  },
  // ... Welcome section with image ...
  {
    "type": "divider"
  },
  // ... Company business block ...
  {
    "type": "divider"
  },
  // ... Culture resources block ...
  {
    "type": "divider"
  }
  // ... Quote of the day and input blocks ...
]
```

This structure can be sent via the Slack API to create the formatted message shown in the example.
