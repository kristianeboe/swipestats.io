"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  CakeIcon,
  LockIcon,
  RainbowIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { type SetStateAction, type Dispatch, useState, useMemo } from "react";

import { Globe2, Crown, MapPin } from "lucide-react";
import { Tabs } from "@/app/_components/ui/tabs";
import { useInsightsProvider } from "./InsightsProvider";
import {
  getProfileGradientClasses,
  getProfileIconColor,
  CREATOR_ID,
  AVERAGE_MALE_ID,
  AVERAGE_FEMALE_ID,
  BRAND_COLORS,
} from "./insightUtils";

export default function DemographicsModal() {
  const [demographicsModalOpen, setDemographicsModalOpen] = useState(false);

  return (
    <>
      <DrawerDialog
        size="7xl"
        open={demographicsModalOpen}
        setOpen={setDemographicsModalOpen}
        trigger={
          <Card.Container className="w-56 cursor-pointer overflow-hidden border-dashed bg-white/50 backdrop-blur-sm transition-colors hover:bg-white/70">
            <div className="flex items-center">
              <div className="h-full w-3 bg-gradient-to-b from-gray-100 to-gray-50" />
              <div className="flex flex-1 items-center gap-4 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-gray-100 p-3">
                    <UsersIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600">
                    Add Comparison
                  </h3>
                  <p className="text-sm text-gray-500">
                    Compare your stats with other individuals and demographics
                  </p>
                </div>
              </div>
            </div>
          </Card.Container>
        }
        title="Demographics"
        description="Compare your stats with other individuals and demographics"
      >
        <DemographicsSections
          closeModal={() => setDemographicsModalOpen(false)}
        />
      </DrawerDialog>
    </>
  );
}

export function DemographicsSections(props: { closeModal: () => void }) {
  const { myTinderId, addComparisonId } = useInsightsProvider();
  const [selectedTab, setSelectedTab] = useState("demographics");

  const form = useForm({
    resolver: zodResolver(
      z.object({
        tinderId: z.string().min(1),
      }),
    ),
    defaultValues: {
      tinderId: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    addComparisonId({ comparisonId: data.tinderId });
    props.closeModal();
  });

  return (
    <div className="space-y-6">
      <Tabs.Root
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <Tabs.List className="mb-4 grid grid-cols-3">
          <Tabs.Trigger
            value="demographics"
            className="flex items-center gap-2"
          >
            <Globe2 className="h-4 w-4" />
            Demographics
          </Tabs.Trigger>
          <Tabs.Trigger value="individual" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Individual
          </Tabs.Trigger>
          {/* <Tabs.Trigger value="premium" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Premium
          </Tabs.Trigger> */}
          {/* <Tabs.Trigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Tabs.Trigger>
          <Tabs.Trigger value="age" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Age
          </Tabs.Trigger> */}
          <Tabs.Trigger value="plus" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Swipestats+
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="demographics" className="space-y-4">
          <div className="space-y-4">
            {/*<div>
               <h2 className="text-xl font-semibold">Global Demographics</h2> */}
            {/* <p className="text-muted-foreground">
                Basic demographic information available to all users
              </p> 
            </div>*/}
            <div className="grid gap-4">
              <div className="space-y-2">
                {/* <h3 className="font-medium">Global averages</h3> */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DemographicsCard
                    comparisonId={CREATOR_ID}
                    data={{
                      title: "The creator of Swipestats",
                      location: "Norway",
                      gender: "Man",
                      interestedInGender: "Women",
                      age: 32,
                      interestedInAge: { min: 24, max: 32 },
                    }}
                    selectTab={setSelectedTab}
                    closeModal={props.closeModal}
                  />
                  <DemographicsCard
                    comparisonId={AVERAGE_MALE_ID}
                    requiredTier="PLUS"
                    data={{
                      title: "Men interested in Women",
                      location: "Global",
                      gender: "Men",
                      interestedInGender: "Women",
                      age: { min: 18, max: 100 },
                      interestedInAge: { min: 18, max: 100 },
                    }}
                    selectTab={setSelectedTab}
                    closeModal={props.closeModal}
                  />
                  <DemographicsCard
                    comparisonId={AVERAGE_FEMALE_ID}
                    requiredTier="PLUS"
                    data={{
                      title: "Women interested in Men",
                      location: "Global",
                      gender: "Women",
                      interestedInGender: "Men",
                      age: { min: 18, max: 100 },
                      interestedInAge: { min: 18, max: 100 },
                    }}
                    selectTab={setSelectedTab}
                    closeModal={props.closeModal}
                  />
                </div>
              </div>
            </div>
            <Alert>
              <RainbowIcon className="h-4 w-4" />
              <AlertTitle>About LGTBQ+ Demographics</AlertTitle>
              <AlertDescription>
                LGTBQ+ demographics are not available yet due to limited data.
                Spread the word about Swipestats and help us change that!
              </AlertDescription>
            </Alert>
          </div>
        </Tabs.Content>

        <Tabs.Content value="individual">
          <Form {...form}>
            <form className="mt-auto space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="tinderId">Swipestats ID</Label>
                <Input
                  id="tinderId"
                  placeholder="Enter a Swipestats ID"
                  required
                  {...form.register("tinderId")}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Profile
              </Button>
            </form>
          </Form>
        </Tabs.Content>

        <Tabs.Content value="premium" className="space-y-4">
          <Card.Container>
            <Card.Header>
              <Card.Title>Premium Insights</Card.Title>
              <Card.Description>
                Detailed demographics for premium subscribers
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Advanced Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">Response Rate</Card.Title>
                      <Badge variant="secondary">Premium</Badge>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-2xl font-bold">48%</p>
                      <p className="text-muted-foreground text-sm">
                        Average response rate
                      </p>
                    </Card.Content>
                  </Card.Container>
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">Match Quality</Card.Title>
                      <Badge variant="secondary">Premium</Badge>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-2xl font-bold">76%</p>
                      <p className="text-muted-foreground text-sm">
                        Compatibility score
                      </p>
                    </Card.Content>
                  </Card.Container>
                </div>
              </div>
            </Card.Content>
          </Card.Container>
        </Tabs.Content>

        <Tabs.Content value="location" className="space-y-4">
          <Card.Container>
            <Card.Header>
              <Card.Title>Location-Based Demographics</Card.Title>
              <Card.Description>
                User distribution by region and city
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Top Locations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">Urban Areas</Card.Title>
                      <Badge>Location</Badge>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-2xl font-bold">78%</p>
                      <p className="text-muted-foreground text-sm">
                        Metropolitan users
                      </p>
                    </Card.Content>
                  </Card.Container>
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">Suburban</Card.Title>
                      <Badge>Location</Badge>
                    </Card.Header>
                    <CardContent>
                      <p className="text-2xl font-bold">22%</p>
                      <p className="text-muted-foreground text-sm">
                        Suburban users
                      </p>
                    </CardContent>
                  </Card.Container>
                </div>
              </div>
            </Card.Content>
          </Card.Container>
        </Tabs.Content>

        <Tabs.Content value="age" className="space-y-4">
          <Card.Container>
            <Card.Header>
              <Card.Title>Age Demographics</Card.Title>
              <Card.Description>
                User distribution by age groups
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Age Groups</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">18-24</Card.Title>
                      <Badge>Age</Badge>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-2xl font-bold">32%</p>
                      <p className="text-muted-foreground text-sm">
                        Young adults
                      </p>
                    </Card.Content>
                  </Card.Container>
                  <Card.Container>
                    <Card.Header>
                      <Card.Title className="text-lg">25-34</Card.Title>
                      <Badge>Age</Badge>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-2xl font-bold">45%</p>
                      <p className="text-muted-foreground text-sm">
                        Professionals
                      </p>
                    </Card.Content>
                  </Card.Container>
                </div>
              </div>
            </Card.Content>
          </Card.Container>
        </Tabs.Content>

        <Tabs.Content value="plus" className="space-y-4">
          <SwipestatsPlusCard />
          {/* <Card.Container>
            <Card.Header>
              <Card.Title>Available Profile Upgrades</Card.Title>
              <Card.Description>
                One-time purchases to permanently upgrade your profile
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <TierSelect />
            </Card.Content>
          </Card.Container> */}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

interface DemographicData {
  title: string;
  location: string;
  gender: "Men" | "Man" | "Women" | "Woman" | "Other" | "Mixed";
  interestedInGender: "Men" | "Women" | "Other" | "Mixed";
  age: number | { min: number; max: number };
  interestedInAge: number | { min: number; max: number };
}

import { MapPinIcon, UsersIcon, CalendarIcon, HeartIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { TierSelect } from "./TierSelect";
import { SwipestatsPlusCard } from "./SwipestatsPlusCard";
import { DrawerDialog } from "@/app/_components/ui/DrawerDialog";
import { ComparisonForm } from "./ComparisonForm";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { useParams, useSearchParams } from "next/navigation";
import { type SwipestatsTier } from "@prisma/client";
import { Form } from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

function formatAge(age: number | { min: number; max: number }): string {
  if (typeof age === "number") {
    return age.toString();
  }
  return `${age.min} - ${age.max}`;
}

export function DemographicsCard({
  data,
  comparisonId,
  requiredTier = "FREE",
  selectTab,
  closeModal,
}: {
  data: DemographicData;
  comparisonId: string;
  requiredTier?: SwipestatsTier;
  selectTab: Dispatch<SetStateAction<string>>;
  closeModal?: () => void;
}) {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const { addComparisonId, removeComparisonId, profiles, comparisonIdsArray } =
    useInsightsProvider();
  const selected = profiles.some((p) => p.tinderId === comparisonId);

  const { swipestatsTier } = useInsightsProvider();

  const hasAccess = swipestatsTier
    ? getTierLevel(swipestatsTier) >= getTierLevel(requiredTier)
    : requiredTier === "FREE";

  const handleClick = () => {
    if (!hasAccess) {
      return;
    }
    setLoading(true);
    if (selected) {
      removeComparisonId({ comparisonId });
    } else {
      addComparisonId({ comparisonId });
    }
    closeModal?.();
  };

  const onDemoProfile = params.tinderId === "demo";

  const isLoading = useMemo(() => {
    if (loading) return true;
    const profileIdInParamsButNotInArray =
      comparisonIdsArray.includes(comparisonId) &&
      profiles.every((p) => p.tinderId !== comparisonId);
    return profileIdInParamsButNotInArray;
  }, [loading, comparisonId, profiles, comparisonIdsArray]);

  // Get the index based on whether this profile is selected
  const index = profiles.findIndex((p) => p.tinderId === comparisonId);
  const gradientClasses = getProfileGradientClasses(comparisonId, index);

  return (
    <Card.Container
      className={`relative w-full max-w-md cursor-pointer overflow-hidden bg-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 ${
        selected ? "scale-[1.02] ring-2 ring-blue-500" : "hover:scale-[1.01]"
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}

      <Card.Header
        className={cn(
          "flex flex-row items-center justify-between space-y-0 bg-gradient-to-br p-4",
          gradientClasses,
        )}
      >
        <Card.Title className="text-xl font-bold text-white dark:text-white">
          {data.title}
        </Card.Title>
      </Card.Header>

      <Card.Content className="grid gap-3 p-4">
        <InfoItem
          icon={MapPin}
          value={data.location}
          comparisonId={comparisonId}
          index={index}
        />
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={UsersIcon}
            label="Gender"
            value={data.gender}
            comparisonId={comparisonId}
            index={index}
          />
          <InfoItem
            icon={HeartIcon}
            label="Interested in"
            value={data.interestedInGender}
            comparisonId={comparisonId}
            index={index}
          />
          <InfoItem
            icon={CakeIcon}
            label="Age"
            value={formatAge(data.age)}
            comparisonId={comparisonId}
            index={index}
          />
          <InfoItem
            icon={SearchIcon}
            label="Looking for"
            value={formatAge(data.interestedInAge)}
            comparisonId={comparisonId}
            index={index}
          />
        </div>
      </Card.Content>

      <Card.Footer className="p-4">
        {!hasAccess || (onDemoProfile && comparisonId !== CREATOR_ID) ? (
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={() => {
              console.log("onClick");
              selectTab?.("plus");
            }}
          >
            <LockIcon className="mr-2 h-4 w-4" />
            Swipestats+ Required -{" "}
            {onDemoProfile ? "Not available in demo" : "Upgrade Now"}
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={selected ? "secondary" : "default"}
            onClick={handleClick}
            disabled={isLoading ?? onDemoProfile}
          >
            {onDemoProfile
              ? comparisonId === CREATOR_ID
                ? "Already viewing"
                : "Not available in demo"
              : selected
                ? "Remove Comparison"
                : "Apply Demographic"}
          </Button>
        )}
      </Card.Footer>
    </Card.Container>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  comparisonId,
  index,
}: {
  icon: React.ElementType;
  label?: string;
  value: string;
  comparisonId: string;
  index: number;
}) {
  const iconColor = getProfileIconColor(comparisonId, index);

  return (
    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow dark:bg-gray-900">
      <Icon style={{ color: iconColor }} className="h-4 w-4" />
      {label && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label}:
        </span>
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {value}
      </span>
    </div>
  );
}

// Helper function to compare tier levels
function getTierLevel(tier: SwipestatsTier): number {
  const levels = {
    FREE: 0,
    PLUS: 1,
    ELITE: 2,
  };
  return levels[tier as keyof typeof levels] || 0;
}
