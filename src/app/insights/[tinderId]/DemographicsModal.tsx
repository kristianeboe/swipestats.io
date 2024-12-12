"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  CakeIcon,
  CheckIcon,
  Ghost,
  InfoIcon,
  LockIcon,
  PlusCircleIcon,
  RainbowIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { type SetStateAction, type Dispatch, useState, useMemo } from "react";
import { Modal } from "@/app/_components/ui/Modal";
import { Globe2, Crown, MapPin, Calendar, Sparkles } from "lucide-react";
import { Tabs } from "@/app/_components/ui/tabs";
import { useInsightsProvider } from "./InsightsProvider";

export default function DemographicsModal() {
  return (
    <>
      <DrawerDialog
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
        <DemographicsSections />
      </DrawerDialog>
    </>
  );
}

export function DemographicsSections() {
  const [selectedTab, setSelectedTab] = useState("individual");

  return (
    <div className="space-y-6">
      <Tabs.Root
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <Tabs.List className="mb-4 grid grid-cols-3">
          <Tabs.Trigger value="individual" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Individual
          </Tabs.Trigger>
          <Tabs.Trigger value="global" className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            Global
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

        <Tabs.Content value="individual">
          <div className="flex gap-4">
            <DemographicsCard
              comparisonId="96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5"
              data={{
                title: "The creator of Swipestats",
                location: "Norway",
                gender: "Man",
                interestedInGender: "Women",
                age: 32,
                interestedInAge: { min: 24, max: 32 },
              }}
              accentColor="blue"
              selectTab={setSelectedTab}
            />
            {/* <ComparisonForm /> */}
            <Card.Container className="flex h-full w-full max-w-sm flex-col">
              <Card.Header>
                <Card.Title>Swipestats User</Card.Title>
                <Card.Description>
                  Add a Swipestats ID to compare
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-1 flex-col justify-end">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tinderId">Swipestats ID</Label>
                    <Input
                      id="tinderId"
                      name="tinderId"
                      placeholder="Enter your Swipestats ID"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Profile
                  </Button>
                </form>
              </Card.Content>
            </Card.Container>
          </div>
        </Tabs.Content>

        <Tabs.Content value="global" className="space-y-4">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DemographicsCard
                    comparisonId="average-MALE-FEMALE-all-1"
                    requiredTier="PLUS"
                    data={{
                      title: "Men interested in Women",
                      location: "Global",
                      gender: "Men",
                      interestedInGender: "Women",
                      age: { min: 18, max: 100 },
                      interestedInAge: { min: 18, max: 100 },
                    }}
                    accentColor="green"
                    selectTab={setSelectedTab}
                  />
                  <DemographicsCard
                    comparisonId="average-FEMALE-MALE-all-1"
                    requiredTier="PLUS"
                    data={{
                      title: "Women interested in Men",
                      location: "Global",
                      gender: "Women",
                      interestedInGender: "Men",
                      age: { min: 18, max: 100 },
                      interestedInAge: { min: 18, max: 100 },
                    }}
                    accentColor="pink"
                    selectTab={setSelectedTab}
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

function formatAge(age: number | { min: number; max: number }): string {
  if (typeof age === "number") {
    return age.toString();
  }
  return `${age.min} - ${age.max}`;
}

function getGradientClasses(color: string): string {
  switch (color) {
    case "pink":
      return "from-pink-400 to-pink-600";
    case "green":
      return "from-green-400 to-green-600";
    default:
      return "from-blue-400 to-blue-600";
  }
}

export function DemographicsCard({
  data,
  accentColor = "blue",
  comparisonId,
  requiredTier = "FREE",
  selectTab,
}: {
  data: DemographicData;
  accentColor?: string;
  comparisonId: string;
  requiredTier?: SwipestatsTier;
  selectTab: Dispatch<SetStateAction<string>>;
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
    setTimeout(() => {
      setLoading(false);
      if (selected) {
        removeComparisonId({ comparisonId });
      } else {
        addComparisonId({ comparisonId });
      }
    }, 1000);
  };

  const onDemoProfile = params.tinderId === "demo";

  const isLoading = useMemo(() => {
    if (loading) return true;
    const profileIdInParamsButNotInArray =
      comparisonIdsArray.includes(comparisonId) &&
      profiles.every((p) => p.tinderId !== comparisonId);
    return profileIdInParamsButNotInArray;
  }, [loading, comparisonId, profiles, comparisonIdsArray]);

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

      <Card.Header className="flex flex-row items-center justify-between space-y-0 bg-gray-200 p-4 dark:bg-gray-700">
        <Card.Title className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {data.title}
        </Card.Title>
        <div
          className={`h-7 w-7 rounded-full bg-gradient-to-br ${getGradientClasses(
            accentColor,
          )}`}
        />
      </Card.Header>

      <Card.Content className="grid gap-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={MapPin}
            value={data.location}
            accentColor={accentColor}
          />
          <InfoItem
            icon={CalendarIcon}
            value={"Nov 2014 - Dec 2024"}
            accentColor={accentColor}
          />
          <InfoItem
            icon={UsersIcon}
            label="Gender"
            value={data.gender}
            accentColor={accentColor}
          />
          <InfoItem
            icon={HeartIcon}
            label="Interested in"
            value={data.interestedInGender}
            accentColor={accentColor}
          />
          <InfoItem
            icon={CakeIcon}
            label="Age"
            value={formatAge(data.age)}
            accentColor={accentColor}
          />
          <InfoItem
            icon={SearchIcon}
            label="Looking for"
            value={formatAge(data.interestedInAge)}
            accentColor={accentColor}
          />
        </div>
      </Card.Content>

      <Card.Footer className="p-4">
        {!hasAccess ? (
          <Button
            type="button"
            variant="default"
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => {
              console.log("onClick");
              selectTab?.("plus");
            }}
          >
            <LockIcon className="mr-2 h-4 w-4" />
            Swipestats+ Required - Upgrade Now
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={selected ? "secondary" : "default"}
            onClick={handleClick}
            disabled={isLoading ?? onDemoProfile}
          >
            {onDemoProfile
              ? "Already viewing"
              : selected
                ? "Remove Comparison"
                : "Apply Demographic"}
          </Button>
        )}
      </Card.Footer>
    </Card.Container>
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

function InfoItem({
  icon: Icon,
  label,
  value,
  accentColor,
}: {
  icon: React.ElementType;
  label?: string;
  value: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow dark:bg-gray-900">
      <Icon className={`h-4 w-4 text-${accentColor}-500`} />
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
