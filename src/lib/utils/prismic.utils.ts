import { isFilled, type LinkField } from "@prismicio/client";
import {
  type BlogPostDocumentData,
  type AuthorDocumentData,
} from "prismicio-types";

export function getPrismicLinkUrl(linkField: LinkField): string {
  if (linkField.link_type === "Web") {
    // @ts-expect-error - We know this is a FilledLinkToWebField
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return linkField.url ?? "#";
  } else {
    throw new Error("Unsupported link type");
  }
}

export const blogPostGraphQuery = `{
        blog_post {
            ...blog_postFields
            author {
                ...on author {
                    ...authorFields
                }
            }
        }
    }`;
export type Author = AuthorDocumentData;

export function getAuthorFromBlog(blogPost: BlogPostDocumentData) {
  // @ts-expect-error supposes that the blogPostGraphQuery has been used in the original query
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return blogPost.author.data as unknown as Author;
}
