"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { DrawerDialog } from "@/app/_components/ui/DrawerDialog";
import { Modal } from "@/app/_components/ui/Modal";
import { ProfileLocationForm } from "@/app/upload/[providerId]/ProfileLocationForm";
import { ProfileLocationModal } from "@/app/upload/[providerId]/ProfileLocationModal";
import { toTitleCase } from "@/lib/utils/string";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import {
  BriefcaseIcon,
  CrownIcon,
  Globe2,
  Instagram,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useInsightsProvider } from "./InsightsProvider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MiniProfileCardProps {
  tinderId: string;
  age: number;
  gender: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
  job: {
    title: string;
    company: string;
  };
  height?: number;
  instagramConnected?: boolean;
  bio?: string;
  interests?: string[];
  descriptors?: string[];
  dataFrom: Date;
  dataTo: Date;
  matchRate?: number;
}

export default function MiniProfileCard({
  tinderId,
  age,
  gender,
  location,
  job,
  height,
  instagramConnected = false,
  bio,
  interests = [],
  descriptors = [],
  dataFrom,
  dataTo,
  matchRate,
}: MiniProfileCardProps) {
  const { myTinderId, swipestatsTier } = useInsightsProvider();
  const unknownLocation =
    !location?.city && !location?.region && !location?.country;

  const [openLocationModal, setOpenLocationModal] = useState(false);

  const locationDisplay = [location.city, location.region, location.country]
    .filter(Boolean)
    .join(", ");

  const router = useRouter();
  const updateLocationMutation = api.profile.updateLocation.useMutation({
    onSuccess: () => {
      toast.success("Location updated");
      router.refresh();
    },
  });

  return (
    <Card.Container className="w-full max-w-sm overflow-hidden">
      <div className="h-12 bg-gradient-to-r from-rose-500 to-rose-300" />
      <Card.Content className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{`${toTitleCase(gender)}, ${age}`}</h2>
            <div className="text-muted-foreground flex items-center text-sm">
              <DrawerDialog
                size="sm"
                trigger={
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-1",
                      myTinderId !== tinderId && "pointer-events-none",
                    )}
                  >
                    <MapPin className="mr-1 h-3 w-3" />
                    {!locationDisplay ? "Unknown" : locationDisplay}
                  </div>
                }
                title="Location"
                description="Help us improve our data by adding your location. You are in charge of how much you want to share."
              >
                <ProfileLocationForm
                  profileLocation={location}
                  onSave={(data) => {
                    console.log(data);
                    updateLocationMutation.mutate({
                      tinderId: tinderId,
                      location: data,
                    });
                  }}
                />
              </DrawerDialog>
            </div>
            {job.title && (
              <div className="text-muted-foreground flex items-center text-sm">
                <BriefcaseIcon className="mr-1 h-3 w-3" />
                {job.title}
                {job.company ? ` at ${job.company}` : ""}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {/* <Badge className="h-6">Match rate: 37%</Badge> */}
            {/* {height && (
              <Badge variant="secondary" className="h-6">
                <Globe2 className="mr-1 h-3 w-3" />
                {height}cm
              </Badge>
            )}
            {instagramConnected && (
              <Badge variant="secondary" className="h-6">
                <Instagram className="h-3 w-3" />
              </Badge>
            )} */}
            {myTinderId === tinderId && swipestatsTier !== "FREE" && (
              <Badge className="h-6">
                <CrownIcon className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>

        {bio && <p className="text-sm">{bio}</p>}

        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {interests.map((interest) => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        )}

        {descriptors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {descriptors.map((descriptor) => (
              <Badge key={descriptor} variant="secondary" className="text-xs">
                {descriptor}
              </Badge>
            ))}
          </div>
        )}
        <div className="text-muted-foreground text-xs">
          Data from {format(dataFrom, "MMM d, yyyy")} to{" "}
          {format(dataTo, "MMM d, yyyy")}
        </div>
      </Card.Content>
    </Card.Container>
  );
}
