import { createPrismicClient } from "@/prismicio";
import { type LinkField } from "@prismicio/client";

import {
  type BlogPostDocumentData,
  type AuthorDocumentData,
} from "prismicio-types";

export function getPrismicLinkUrl(linkField?: LinkField): string {
  if (!linkField) return "#"; // to not crash the site if the link is not defined on prismic
  if (linkField.link_type === "Web") {
    // @ts-expect-error - We know this is a FilledLinkToWebField
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return linkField.url ?? "#";
  } else if (linkField.link_type === "Any") {
    return "#";
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
  return blogPost.author.data as unknown as Author | undefined;
}

export async function getBlogPostAndAuthor(uid: string) {
  const client = createPrismicClient();
  const page = await client.getByUID("blog_post", uid, {
    graphQuery: blogPostGraphQuery,
  });
  // .catch(() => notFound());
  // console.log("page", page);
  const author = getAuthorFromBlog(page.data);

  return {
    blog: page,
    author,
  };
}

// ? Failed experiment
// export function createDefaultContentForSlice<T>(slice: SliceComponentProps["slice"] , obj: Record<
//   typeof slice.variation,
//   Record<keyof typeof slice.primary, string>) {
//     return obj
// }
// ? Just use this pattern instead and define it top of file
// const variationsDefaultContent: Record<
// typeof slice.variation,
// Record<keyof typeof slice.primary, string>
// > = {
// default: {
//   heading: "Visualize Your Tinder Data",
//   body: "Curious where you stand on the dating market? Anonymously upload your data to Swipestats and find out today (it's free)",
//   emoji: "📊",
//   cta_link_label: "Learn How(It's FREE)",
//   link: "https://swipestats.io",
//   image: "/ss2.png",
// },
// visualizeYourTinderData: {
//   heading: "Visualize Your Tinder Data",
//   body: "Curious where you stand on the dating market? Anonymously upload your data to Swipestats and find out today (it's free)",
//   emoji: "📊",
//   cta_link_label: "Learn How(It's FREE)",
//   link: "https://swipestats.io",
//   image: "/ss2.png",
// },
// };
