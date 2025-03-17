import "server-only";
import { OpenPanel } from "@openpanel/nextjs";
import { env } from "@/env";

export const openpanel = new OpenPanel({
  clientId: env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID,
  clientSecret: env.OPEN_PANEL_SECRET,
});
