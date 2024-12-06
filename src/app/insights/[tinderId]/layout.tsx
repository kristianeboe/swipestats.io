import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/app/_components/ui/toggle-group";
import { ChartArea, ChartNetwork, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { InsightsProvider } from "./InsightsProvider";
import { api } from "@/trpc/server";
import Profiles from "./Profiles";

export default async function InsightsLayout(props: {
  params: { tinderId: string };
  children: React.ReactNode;
}) {
  const swipestatsProfile = await api.profile.get({
    tinderId: props.params.tinderId,
  });

  if (!swipestatsProfile) {
    notFound();
  }

  return (
    <div className="pt-12">
      <h1 className="text-center text-5xl font-black">Swipestats</h1>
      <div>Compare</div>
      <InsightsProvider myTinderProfile={swipestatsProfile}>
        
        {/* <div className="mt-4">
        <ToggleGroup value={activeTab} type="single" className="hidden">
          <Link href={`/insights/${props.params.tinderId}`}>
            <ToggleGroupItem
              value="charts"
              aria-label="Charts"
              className="flex gap-2"
            >
              <ChartArea className="h-4 w-4" /> <span>Charts</span>
            </ToggleGroupItem>
          </Link>
          <Link href={`/insights/${props.params.tinderId}/flow`}>
            <ToggleGroupItem
              value="flow"
              aria-label="Network"
              className="flex gap-2"
            >
              <ChartNetwork className="h-4 w-4" /> <span>Flow</span>
            </ToggleGroupItem>
          </Link>
          <Link href={`/insights/${props.params.tinderId}/messages`}>
            <ToggleGroupItem
              value="messages"
              aria-label="Messages"
              className="flex gap-2"
            >
              <MessageCircle className="h-4 w-4" /> <span>Messages</span>
            </ToggleGroupItem>
          </Link>
        </ToggleGroup>
      </div> */}
        {/* <div>
        <Tabs.Root value={activeTab} className="">
          <Tabs.List>
            <Link href={`/insights/${props.params.tinderId}`}>
              <Tabs.Trigger value="charts">Charts</Tabs.Trigger>
            </Link>
            <Link href={`/insights/${props.params.tinderId}/flow`}>
              <Tabs.Trigger value="flow">Flow</Tabs.Trigger>
            </Link>
            <Link href={`/insights/${props.params.tinderId}/settings`}>
              <Tabs.Trigger value="flow">Settings</Tabs.Trigger>
            </Link>
          </Tabs.List>
        </Tabs.Root>
      </div> */}
        <div>{props.children}</div>
      </InsightsProvider>
    </div>
  );
}
