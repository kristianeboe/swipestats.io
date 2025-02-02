"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { DrawerDialog } from "@/app/_components/ui/DrawerDialog";

import { ProfileLocationForm } from "@/app/upload/[providerId]/ProfileLocationForm";
import { toTitleCase } from "@/lib/utils/string";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import {
  BriefcaseIcon,
  CrownIcon,
  MapPin,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useInsightsProvider } from "./InsightsProvider";
import { cn, getAgeFromBirthdate, getInterestedInDisplay } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { getTailwindGradientClasses, getProfileTitle } from "./insightUtils";

export default function MiniProfileCard(props: {
  fullTinderProfile: FullTinderProfile;
  index: number;
}) {
  const { myTinderId, swipestatsTier, removeComparisonId } =
    useInsightsProvider();

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const locationDisplay = [
    props.fullTinderProfile.city,
    props.fullTinderProfile.region,
    props.fullTinderProfile.country,
  ]
    .filter(Boolean)
    .join(", ");

  // If it's a special profile (has a title) and no location, show Global
  const displayLocation =
    getProfileTitle(props.fullTinderProfile.tinderId) && !locationDisplay
      ? "Global"
      : locationDisplay || "Unknown";

  const router = useRouter();
  const updateLocationMutation = api.profile.updateLocation.useMutation({
    onSuccess: () => {
      toast.success("Location updated");
      router.refresh();
    },
  });

  const allowRemoveComparison = myTinderId !== props.fullTinderProfile.tinderId;
  const specialTitle = getProfileTitle(props.fullTinderProfile.tinderId);

  return (
    <Card.Container className="w-full max-w-sm overflow-hidden">
      <div
        className={cn(
          "relative h-12 bg-gradient-to-r",
          getTailwindGradientClasses(
            props.fullTinderProfile.tinderId,
            props.index,
          ),
        )}
      >
        {allowRemoveComparison && (
          <div className="absolute right-1 top-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                removeComparisonId({
                  comparisonId: props.fullTinderProfile.tinderId,
                })
              }
              className="h-6 w-6"
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Card.Content className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-1 text-lg font-semibold">
              {specialTitle
                ? `${specialTitle}, ${getAgeFromBirthdate(
                    props.fullTinderProfile.birthDate,
                  )}`
                : `${toTitleCase(props.fullTinderProfile.gender)}, ${getAgeFromBirthdate(
                    props.fullTinderProfile.birthDate,
                  )}`}{" "}
              {myTinderId === props.fullTinderProfile.tinderId &&
                swipestatsTier !== "FREE" && (
                  <Badge className="h-5 rounded-full p-2">
                    <CrownIcon className="h-3 w-3" />
                  </Badge>
                )}
            </h2>
            <div className="text-muted-foreground flex items-center text-sm">
              <DrawerDialog
                size="sm"
                open={locationModalOpen}
                setOpen={setLocationModalOpen}
                trigger={
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-1",
                      myTinderId !== props.fullTinderProfile.tinderId &&
                        "pointer-events-none",
                    )}
                  >
                    <MapPin className="mr-1 h-3 w-3" />
                    {displayLocation}
                  </div>
                }
                title="Location"
                description="Help us improve our data by adding your location. You are in charge of how much you want to share."
              >
                <ProfileLocationForm
                  profileLocation={{
                    city: props.fullTinderProfile.city ?? "",
                    region: props.fullTinderProfile.region ?? "",
                    country: props.fullTinderProfile.country ?? "",
                  }}
                  onSave={(data) => {
                    console.log(data);
                    updateLocationMutation.mutate({
                      tinderId: props.fullTinderProfile.tinderId,
                      location: data,
                    });
                  }}
                />
              </DrawerDialog>
            </div>
            <div>
              {props.fullTinderProfile.jobTitle && (
                <div className="text-muted-foreground flex items-center text-sm">
                  <BriefcaseIcon className="mr-1 h-3 w-3" />
                  {props.fullTinderProfile.jobTitle}
                  {props.fullTinderProfile.company
                    ? ` at ${props.fullTinderProfile.company}`
                    : ""}
                </div>
              )}
            </div>
            <div className="flex items-center text-sm">
              <SearchIcon className="mr-1 h-3 w-3" />
              Looking for{" "}
              {getInterestedInDisplay(
                props.fullTinderProfile.interestedIn,
              )}{" "}
              ages {props.fullTinderProfile.ageFilterMin} -{" "}
              {props.fullTinderProfile.ageFilterMax}
            </div>
          </div>
          <div className="flex gap-1">
            {/* <Badge className="h-6">Match rate: 37%</Badge> */}
            {/* {props.height && (
              <Badge variant="secondary" className="h-6">
                <Globe2 className="mr-1 h-3 w-3" />
                {props.height}cm
              </Badge>
            )}
            {props.instagramConnected && (
              <Badge variant="secondary" className="h-6">
                <Instagram className="h-3 w-3" />
              </Badge>
            )} */}
          </div>
        </div>

        {/* {props.fullTinderProfile.bio && (
          <p className="text-sm">{props.fullTinderProfile.bio}</p>
        )} */}

        {/* {props.fullTinderProfile.interests &&
          props.fullTinderProfile.descriptors?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {props.fullTinderProfile.descriptors.map((descriptor) => (
                <Badge key={descriptor} variant="outline" className="text-xs">
                  {descriptor}
                </Badge>
              ))}
            </div>
          )} */}

        <div className="text-muted-foreground text-xs">
          Data from{" "}
          {format(props.fullTinderProfile.firstDayOnApp, "MMM d, yyyy")} to{" "}
          {format(props.fullTinderProfile.lastDayOnApp, "MMM d, yyyy")}
        </div>
      </Card.Content>
    </Card.Container>
  );
}
