import { type NextRequest } from "next/server";
import { redirectToPreviewURL } from "@prismicio/next";

import { draftMode } from "next/headers";
import { createPrismicClient } from "@/prismicio";

export async function GET(request: NextRequest) {
  const client = createPrismicClient();
  draftMode().enable();

  return await redirectToPreviewURL({ client, request });
}
