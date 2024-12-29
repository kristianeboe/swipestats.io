import {
  TinderJsonGenderValues,
  type SwipestatsProfilePayload,
  type TinderJsonGender,
} from "@/lib/interfaces/TinderDataJSON";
import { getGenderDisplay, isGenderDataUnknown } from "@/lib/utils";
import { type Dispatch, type SetStateAction, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Label } from "@/app/_components/ui/label";
import he from "he";

import { Button } from "@/app/_components/ui/button";
import { Text } from "@/app/_components/ui/text";

export function UploadProfileCard({
  // dataJSON,
  swipestatsProfilePayload,
  updateProfileGenderData,
  genderDataAutoUpdated,
  setGenderDataAutoUpdated,
  updateProfileLocationData,
}: {
  // dataJSON: FullTinderDataJSON;
  swipestatsProfilePayload: SwipestatsProfilePayload;
  updateProfileGenderData: (params: {
    gender: TinderJsonGender;
    genderFilter: TinderJsonGender;
    interestedIn: TinderJsonGender;
  }) => void;
  updateProfileLocationData: (params: {
    city: string;
    region: string;
    country: string;
    continent: string;
  }) => void;
  genderDataAutoUpdated: boolean;
  setGenderDataAutoUpdated: Dispatch<SetStateAction<boolean>>;
}) {
  const tinderId = swipestatsProfilePayload.tinderId;
  const userData = swipestatsProfilePayload.anonymizedTinderJson.User;
  const travelLocationInfo = userData.travel_location_info;

  const [showGenderForm, setShowGenderForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);

  // <pre>{Object.keys(dataJSON).join(", ")}</pre>;
  // const { Messages, Usage, ...json } = dataJSON;
  const hasUnknownGender = isGenderDataUnknown(userData.gender);

  const debug = false;

  const { firstDayOnApp, lastDayOnApp } = getFirstAndLastDayOnApp(
    swipestatsProfilePayload.anonymizedTinderJson.Usage.app_opens,
  );

  // const regionIsState = !!(
  //   userData.city?.region && US_STATES[userData.city.region]
  // );

  return (
    <>
      {debug && <pre>{Object.keys(userData).join(", ")}</pre>}

      <div className="relative max-w-xl overflow-hidden rounded bg-white shadow-lg">
        {/* <div className="w-full flex justify-center">
      <img className="w-48 p-4" :src="imgSrc" alt="Sunset in the mountains" />
    </div> */}
        <div className="group flex justify-center rounded-lg bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 py-2">
          {/* <Image
            src={
              isMale
                ? "/images/svgs/undraw_male_avatar.svg" //  require('/assets/imgs/undraw_male_avatar.svg') //  '/assets/imgs/undraw_male_avatar.svg'
                : "/images/svgs/undraw_female_avatar.svg" // require('/assets/imgs/undraw_female_avatar.svg') // '/assets/imgs/undraw_female_avatar.svg' //  'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80'
            }
            alt=""
            className="pointer-events-none object-cover  px-40 "
            height={160}
            width={160}
          /> */}
          {hasUnknownGender ? (
            <UnknownAvatar />
          ) : userData.gender === "M" ? (
            <MaleAvatar />
          ) : (
            <FemaleAvatar />
          )}
          {/* <Carousel>
            <CarouselContent>
              <CarouselItem>
                {hasUnknownGender ? (
                  <UnknownAvatar />
                ) : userData.gender === "M" ? (
                  <MaleAvatar />
                ) : (
                  <FemaleAvatar />
                )}
              </CarouselItem>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel> */}
        </div>
        {genderDataAutoUpdated && !showGenderForm ? (
          <div className="p-4">
            <Alert className="">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>
                Heads up! Some of your gender data has been automatically
                updated
              </AlertTitle>
              <AlertDescription>
                Don&apos;t worry, this happens sometimes. Basically your data
                file said gender: &quot;Unknown&quot; and/or interested_in:
                &quot;Unknown&quot;. We updated it to gender: &quot;M&quot;,
                interested_in: &quot;F&quot;. If this is incorrect, please
                update it.
              </AlertDescription>
              <AlertDescription className="mt-2 flex gap-2">
                <Button
                  onClick={() => {
                    setGenderDataAutoUpdated(false);
                    analyticsTrackClient("Profile Gender Data Confirmed");
                  }}
                >
                  It&apos;s correct
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    analyticsTrackClient(
                      "Profile Gender Data Update Initiated",
                    );
                    setShowGenderForm(true);
                  }}
                >
                  Update gender data
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : null}

        <div className="px-6 py-4">
          {showGenderForm ? (
            <div className="">
              <Text.H3>
                Your gender is defined as unknown in your data file. Please
                confirm the following:
              </Text.H3>

              {/* <Text.Large>
                Your gender is defined as unknown in your datafile. Please
                confirm the following:
              </Text.Large> */}
              <GenderUpdateForm
                swipestatsProfilePayload={swipestatsProfilePayload}
                onSubmit={(data) => {
                  console.log(data);
                  // toast("You submitted the following values:", {
                  //   description: (
                  //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  //       <code className="text-white">
                  //         {JSON.stringify(data, null, 2)}
                  //       </code>
                  //     </pre>
                  //   ),
                  // });
                  updateProfileGenderData(data);
                  setShowGenderForm(false);
                  setGenderDataAutoUpdated(false);
                  analyticsTrackClient("Profile Gender Data Updated");
                }}
              />
            </div>
          ) : showLocationForm ? (
            <div>
              <ProfileLocationForm
                profileLocation={{
                  city: userData.city?.name ?? "",
                  region: userData.city?.region ?? "",
                }}
                onSave={(data) => {
                  updateProfileLocationData(data);
                  setShowLocationForm(false);
                }}
                onCancel={() => setShowLocationForm(false)}
              />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold">
                    {`${getGenderDisplay(userData.gender)}, ${differenceInYears(
                      new Date(),
                      new Date(userData.birth_date),
                    )}`}
                  </div>
                  {userData.city && (
                    <p
                      className="cursor-pointer text-base text-gray-700"
                      onClick={() => setShowLocationForm(true)}
                    >
                      {userData.city.name}, {userData.city.region}
                    </p>
                  )}
                </div>
                <div className="text-muted-foreground text-right text-xs">
                  <div>
                    Account created:{" "}
                    {format(userData.create_date, "MMM d, yyyy")}
                  </div>
                  <div>Last active: {format(lastDayOnApp, "MMM d, yyyy")}</div>
                </div>
              </div>
              {userData.bio && (
                <>
                  {/* <Text.Lead>Bio</Text.Lead> */}
                  <Text.Prose className="mt-4">
                    {he.decode(userData.bio)}
                  </Text.Prose>
                </>
              )}

              <p className="pt-4 text-base text-gray-700">
                <strong>Looking for</strong>{" "}
                {userData.interested_in === "F" ? "women" : "men"} ages{" "}
                {userData.age_filter_min}-{userData.age_filter_max}
              </p>

              {userData.jobs?.length && (
                <section className="mt-4">
                  <h2 className="font-bold">Work</h2>
                  {userData.jobs?.map((job) => (
                    <div key={job.title?.name}>
                      {false && (
                        <button
                          type="button"
                          className="float-right rounded bg-gray-500 p-2"
                          // @click="removeKeyFromUserData('jobs')"
                        >
                          Don&apos;t share
                        </button>
                      )}

                      <div>
                        {job.title?.name}{" "}
                        {job.company?.displayed ? "@ " + job.company?.name : ""}{" "}
                      </div>
                    </div>
                  ))}
                </section>
              )}
              {userData.schools?.length && (
                <section className="mt-4">
                  <h2 className="font-bold">Education</h2>
                  {userData.schools.map((school) => (
                    <div key={school?.name}>
                      {false && (
                        <button
                          type="button"
                          className="float-right rounded bg-gray-500 p-2"
                          // @click="removeKeyFromUserData('schools')"
                        >
                          Don&apos;t share
                        </button>
                      )}

                      <div>School: {school?.name}</div>
                      {/* <div>Show school: { school.displayed }</div> */}
                    </div>
                  ))}
                </section>
              )}

              {userData?.user_interests?.length && (
                <div className="mt-4">
                  <h2 className="mb-1 font-bold">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData?.user_interests?.map((interest: string) => (
                      <Badge variant={"secondary"} key={interest}>
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {userData?.descriptors?.length && (
                <div className="mt-4">
                  <h2 className="mb-1 font-bold">Descriptors</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData?.descriptors?.map((descriptor, i) => (
                      <Badge variant={"secondary"} key={i}>
                        {descriptor.choices.join(", ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(userData?.instagram || userData?.spotify) && (
                <div className="mt-4">
                  <h2 className="mb-1 font-bold">Connected accounts</h2>
                  {userData.instagram && (
                    <span className="mr-2 inline-block rounded-full bg-purple-200 px-3 py-1 text-sm font-semibold text-gray-700">
                      #instagram
                    </span>
                  )}

                  {userData.spotify && (
                    <span className="mr-2 inline-block rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-gray-700">
                      #spotify
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {debug && (
        <div>
          {/* <pre>{JSON.stringify(json, undefined, 2)}</pre> */}
          {/* <div>Usage test</div>
      <pre>{JSON.stringify(Usage, undefined, 2)}</pre>
      <div>Messages test</div>
      <pre>{JSON.stringify(Messages, undefined, 2)}</pre> */}
        </div>
      )}
    </>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";

import { FemaleAvatar, MaleAvatar, UnknownAvatar } from "./AvatarSVGs";
import { differenceInYears, format } from "date-fns";
import { getFirstAndLastDayOnApp } from "@/lib/profile.utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { FileTextIcon, ShieldAlert } from "lucide-react";

import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/ui/carousel";
import { Badge } from "@/app/_components/ui/badge";
import { US_STATES } from "@/lib/utils/usStates";
import { ProfileLocationForm } from "./ProfileLocationForm";

const FormSchema = z.object({
  gender: z.enum(TinderJsonGenderValues, {
    required_error: "You need to select a gender type.",
  }),
  genderFilter: z.enum(TinderJsonGenderValues, {
    required_error: "You need to select a gender type.",
  }),
  interestedIn: z.enum(TinderJsonGenderValues, {
    required_error: "You need to select a gender type.",
  }),
});

function GenderUpdateForm(props: {
  swipestatsProfilePayload: SwipestatsProfilePayload;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gender: props.swipestatsProfilePayload.anonymizedTinderJson.User.gender,
      genderFilter:
        props.swipestatsProfilePayload.anonymizedTinderJson.User.gender_filter,
      interestedIn:
        props.swipestatsProfilePayload.anonymizedTinderJson.User.interested_in,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="mt-4 max-w-md space-y-6"
      >
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What is your gender?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <GenderSelect fieldName="gender" />
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genderFilter"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Who are you looking for?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  //className="grid grid-cols-3 gap-4"
                >
                  <GenderSelect fieldName="genderFilter" />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interestedIn"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Who are you interested in?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  // className="grid grid-cols-3 gap-4"
                >
                  <GenderSelect fieldName="interestedIn" />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function GenderSelect(props: {
  fieldName: "gender" | "genderFilter" | "interestedIn";
}) {
  const pluralize = props.fieldName === "gender" ? false : true;
  return (
    <div className="flex flex-wrap gap-4">
      <Label
        htmlFor={`${props.fieldName}-male`}
        className="flex items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
      >
        <RadioGroupItem id={`${props.fieldName}-male`} value="M" />
        <span>{pluralize ? "Men" : "Man"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height={20}
          width={20}
          fill="currentColor"
        >
          <path d="M15.0491 8.53666L18.5858 5H14V3H22V11H20V6.41421L16.4633 9.95088C17.4274 11.2127 18 12.7895 18 14.5C18 18.6421 14.6421 22 10.5 22C6.35786 22 3 18.6421 3 14.5C3 10.3579 6.35786 7 10.5 7C12.2105 7 13.7873 7.57264 15.0491 8.53666ZM10.5 20C13.5376 20 16 17.5376 16 14.5C16 11.4624 13.5376 9 10.5 9C7.46243 9 5 11.4624 5 14.5C5 17.5376 7.46243 20 10.5 20Z"></path>
        </svg>
      </Label>
      <Label
        htmlFor={`${props.fieldName}-female`}
        className="flex items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
      >
        <RadioGroupItem id={`${props.fieldName}-female`} value="F" />
        <span>{pluralize ? "Women" : "Woman"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height={20}
          width={20}
          fill="currentColor"
        >
          <path d="M11 15.9339C7.33064 15.445 4.5 12.3031 4.5 8.5C4.5 4.35786 7.85786 1 12 1C16.1421 1 19.5 4.35786 19.5 8.5C19.5 12.3031 16.6694 15.445 13 15.9339V18H18V20H13V24H11V20H6V18H11V15.9339ZM12 14C15.0376 14 17.5 11.5376 17.5 8.5C17.5 5.46243 15.0376 3 12 3C8.96243 3 6.5 5.46243 6.5 8.5C6.5 11.5376 8.96243 14 12 14Z"></path>
        </svg>
      </Label>
      <Label
        htmlFor={`${props.fieldName}-other`}
        className="flex items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
      >
        <RadioGroupItem id={`${props.fieldName}-other`} value="Other" />
        <span>Other</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height={20}
          width={20}
          fill="currentColor"
        >
          <path d="M13 7.06609C16.6694 7.55498 19.5 10.6969 19.5 14.5C19.5 18.6421 16.1421 22 12 22C7.85786 22 4.5 18.6421 4.5 14.5C4.5 10.6969 7.33064 7.55498 11 7.06609V1H13V7.06609ZM12 20C15.0376 20 17.5 17.5376 17.5 14.5C17.5 11.4624 15.0376 9 12 9C8.96243 9 6.5 11.4624 6.5 14.5C6.5 17.5376 8.96243 20 12 20Z"></path>
        </svg>
      </Label>
    </div>
  );
}
