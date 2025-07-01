"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/_components/ui/card";
import {
  LockIcon,
  UsersRound,
  UserCog,
  Sparkles,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";
import { type SetStateAction, type Dispatch, useState, useMemo } from "react";

import {
  MapPin,
  Globe,
  Users2,
  HeartHandshake,
  CalendarDays,
  Target,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/_components/ui/dialog";
import { useInsightsProvider } from "./InsightsProvider";
import { CREATOR_ID, AVERAGE_MALE_ID, AVERAGE_FEMALE_ID } from "./insightUtils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { SwipestatsPlusCard } from "./SwipestatsPlusCard";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { useParams } from "next/navigation";
import { type SwipestatsTier } from "@prisma/client";
import { Form } from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface DemographicDetailProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor?: string;
}

const DemographicDetail: React.FC<DemographicDetailProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-muted-foreground",
}) => (
  <div className="flex items-center space-x-2 text-sm">
    <Icon className={`h-4 w-4 ${iconColor}`} />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default function DemographicsModal() {
  const [demographicsModalOpen, setDemographicsModalOpen] = useState(false);

  return (
    <>
      <Dialog
        open={demographicsModalOpen}
        onOpenChange={setDemographicsModalOpen}
      >
        <DialogTrigger asChild>
          <Card className="w-56 cursor-pointer gap-0 overflow-hidden border-dashed bg-white/50 py-0 backdrop-blur-sm transition-colors hover:bg-white/70">
            <div className="flex h-full items-center">
              <div className="flex flex-1 items-center gap-4 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 rounded-full bg-gray-100 p-3">
                    <UsersRound className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-gray-600">
                    Add Comparison
                  </h3>
                  <p className="text-sm text-gray-500">
                    Compare your stats with other individuals and demographics
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-white p-0 sm:max-w-5xl md:max-w-6xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">
              Demographics
            </DialogTitle>
            <DialogDescription>
              Compare your stats with other individuals and demographics.
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="p-6">
            <DemographicsSections
              closeModal={() => setDemographicsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
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
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-3">
        <TabsTrigger value="demographics" className="flex items-center gap-2">
          <UsersRound className="h-4 w-4" />
          Demographics
        </TabsTrigger>
        <TabsTrigger value="individual" className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Individual
        </TabsTrigger>
        <TabsTrigger value="plus" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Swipestats+
        </TabsTrigger>
      </TabsList>

      <TabsContent value="demographics">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            accentColor="border-rose-500"
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
            accentColor="border-sky-500"
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
            accentColor="border-pink-500"
            selectTab={setSelectedTab}
            closeModal={props.closeModal}
          />
        </div>

        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            About LGBTQ+ Demographics
          </AlertTitle>
          <AlertDescription>
            LGBTQ+ demographics are not yet available due to limited data.
            Spread the word about Swipestats and help us change that!
          </AlertDescription>
        </Alert>
      </TabsContent>

      <TabsContent value="individual">
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
      </TabsContent>

      <TabsContent value="plus">
        <SwipestatsPlusCard />
      </TabsContent>
    </Tabs>
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

function formatAge(age: number | { min: number; max: number }): string {
  if (typeof age === "number") {
    return age.toString();
  }
  return `${age.min} - ${age.max}`;
}

export function DemographicsCard({
  data,
  comparisonId,
  accentColor,
  requiredTier = "FREE",
  selectTab,
  closeModal,
}: {
  data: DemographicData;
  comparisonId: string;
  accentColor: string;
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

  // Get the icon color based on accent color
  const getIconColor = () => {
    if (accentColor.includes("rose")) return "text-rose-500";
    if (accentColor.includes("sky")) return "text-sky-500";
    if (accentColor.includes("pink")) return "text-pink-500";
    return "text-muted-foreground";
  };

  const iconColor = getIconColor();

  const details = [
    {
      icon: data.location === "Global" ? Globe : MapPin,
      label: "Location",
      value: data.location,
      iconColor,
    },
    { icon: Users2, label: "Gender", value: data.gender },
    {
      icon: HeartHandshake,
      label: "Interested in",
      value: data.interestedInGender,
    },
    { icon: CalendarDays, label: "Age", value: formatAge(data.age) },
    {
      icon: Target,
      label: "Looking for",
      value: formatAge(data.interestedInAge),
    },
  ];

  const isPremium =
    !hasAccess || (onDemoProfile && comparisonId !== CREATOR_ID);
  const isCurrentlyViewing = selected && comparisonId === CREATOR_ID;

  return (
    <Card className={`flex flex-col ${accentColor} relative border-t-4`}>
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {details.map((detail, index) => (
          <DemographicDetail key={index} {...detail} />
        ))}
      </CardContent>

      <CardFooter>
        {isPremium ? (
          <Button
            className="w-full bg-red-600 text-white hover:bg-red-700"
            onClick={() => selectTab?.("plus")}
            disabled={isLoading}
          >
            <LockIcon className="mr-2 h-4 w-4" />
            {onDemoProfile && comparisonId !== CREATOR_ID
              ? "Not available in demo"
              : "Swipestats+ Required"}
          </Button>
        ) : isCurrentlyViewing ? (
          <Button
            className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100"
            variant="secondary"
            disabled={true}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Currently Viewing
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={selected ? "secondary" : "default"}
            onClick={handleClick}
            disabled={isLoading}
          >
            {selected ? "Remove Comparison" : "Apply Demographic"}
          </Button>
        )}
      </CardFooter>
    </Card>
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
