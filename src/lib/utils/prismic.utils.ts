import { type LinkField } from "@prismicio/client";

export function getPrismicLinkUrl(linkField: LinkField): string {
  if (linkField.link_type === "Web") {
    // @ts-expect-error - We know this is a FilledLinkToWebField
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return linkField.url ?? "#";
  } else {
    throw new Error("Unsupported link type");
  }
}
