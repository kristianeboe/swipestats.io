"use client";
import { useRouter } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { UploadProfileCard } from "./UploadProfileCard";

import type {
  SwipestatsProfilePayload,
  TinderJsonGender,
} from "@/lib/interfaces/TinderDataJSON";
import { api } from "@/trpc/react";
import { logger } from "@/lib/tslog";
import { track } from "@vercel/analytics";
import { Button } from "@/app/_components/ui/button";

import { HeartIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { SLink } from "@/app/_components/ui/SLink";
import { toast } from "sonner";
import { getISODayKey, isGenderDataUnknown } from "@/lib/utils";
import { getFirstAndLastDayOnApp } from "@/lib/profile.utils";
import { formatDistanceToNow } from "date-fns";

export function UploadCTA(props: {
  swipestatsProfilePayload: SwipestatsProfilePayload;
  // jsonProfile: FullTinderDataJSON;
  updatePayload: Dispatch<SetStateAction<SwipestatsProfilePayload | null>>;
}) {
  const log = logger.getSubLogger({ name: "upload-cta" });
  const router = useRouter();
  const userData = props.swipestatsProfilePayload.anonymizedTinderJson.User;
  const [acceptedTerms, _setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const existingProfileQuery = api.profile.get.useQuery(
    {
      tinderId: props.swipestatsProfilePayload.tinderId,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const profileCreateMutation = api.profile.create.useMutation({
    onSuccess: (data) => {
      log.info("Tinder profile created API Return %O", data);

      router.push("/insights/" + data.tinderId);
    },
    onError: (error) => {
      toast.error("Failed to create profile");
      console.error(error);
      setLoading(false);
    },
  });

  const profileUpdateMutation = api.profile.update.useMutation({
    onSuccess: (data) => {
      log.info("Tinder profile created API Return %O", data);

      router.push("/insights/" + data.tinderId);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  }); // todo consider rolling these two together again

  const profileSimulateUploadMutation =
    api.profile.simulateProfileUplad.useMutation({});

  async function uploadProfile() {
    setLoading(true);

    track("Profile Upload Initialized", {
      providerId: "TINDER",
    });
    try {
      if (!existingProfileQuery.data) {
        profileCreateMutation.mutate(props.swipestatsProfilePayload);

        // track("Profile Created", { // ? moved to server
        //   tinderId: tinderProfile.tinderId,
        // });
        // await ky
        //   .post('/api/profiles', {
        //     json: props.swipestatsProfilePayload,
        //     timeout: false,
        //   })
        //   .json<TinderProfilePrisma>()
        //   .then((tinderProfile) => {
        //     log('Tinder profile created API Return %O', tinderProfile);
        //     analyticsSDK.profile.created({ tinderId: tinderProfile.tinderId });
        //     router.push('/insights/?id=' + tinderProfile.tinderId);
        //   });
      } else {
        profileUpdateMutation.mutate(props.swipestatsProfilePayload);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const hasUnknownGender = isGenderDataUnknown(userData.gender);
  const hasUnknownInterestedIn = isGenderDataUnknown(userData.interested_in);
  const hasUnknownGenderFilter = isGenderDataUnknown(userData.gender_filter);
  const [genderDataAutoUpdated, setGenderDataAutoUpdated] = useState(false);

  const updateProfileGenderData = useCallback(
    (params: {
      gender: TinderJsonGender;
      genderFilter: TinderJsonGender;
      interestedIn: TinderJsonGender;
    }) => {
      props.updatePayload({
        tinderId: props.swipestatsProfilePayload.tinderId,
        anonymizedTinderJson: {
          ...props.swipestatsProfilePayload.anonymizedTinderJson,
          User: {
            ...userData,
            gender: params.gender,
            gender_filter: params.genderFilter,
            interested_in: params.interestedIn,
          },
        },
      });
    },
    [props, userData],
  );

  useEffect(() => {
    if (
      !genderDataAutoUpdated &&
      (hasUnknownGender || hasUnknownInterestedIn || hasUnknownGenderFilter)
    ) {
      track("Profile Gender Data Auto Updated", {
        providerId: "TINDER",
        profileId: props.swipestatsProfilePayload.tinderId,
      });
      updateProfileGenderData({
        gender: "M",
        genderFilter: "F",
        interestedIn: "F",
      });
      setGenderDataAutoUpdated(true);
    }
  }, [
    genderDataAutoUpdated,
    hasUnknownGender,
    hasUnknownGenderFilter,
    hasUnknownInterestedIn,
    props.swipestatsProfilePayload.tinderId,
    updateProfileGenderData,
  ]);

  const lastDayOnAppSameAsLastUpload = useMemo(() => {
    const existingDataLastDayOnAppIsoDayKey =
      existingProfileQuery.data &&
      getISODayKey(existingProfileQuery.data.lastDayOnApp);

    const {
      //  firstDayOnApp,
      lastDayOnApp,
    } = getFirstAndLastDayOnApp(
      props.swipestatsProfilePayload.anonymizedTinderJson.Usage.app_opens,
    );
    const newDataLastDayOnAppIsoDayKey = getISODayKey(lastDayOnApp);

    return existingDataLastDayOnAppIsoDayKey === newDataLastDayOnAppIsoDayKey;
  }, [
    existingProfileQuery.data,
    props.swipestatsProfilePayload.anonymizedTinderJson.Usage.app_opens,
  ]);

  const disableUpload = useMemo(() => {
    if (!acceptedTerms) return true;

    if (lastDayOnAppSameAsLastUpload) return true;

    if (genderDataAutoUpdated) return true;

    return false;
  }, [acceptedTerms, genderDataAutoUpdated, lastDayOnAppSameAsLastUpload]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-around gap-5">
        <div className="text-center md:text-left ">
          <h2 className="text-base font-semibold uppercase tracking-wide text-rose-600">
            Upload
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Ready
          </p>
          <p className="mx-auto mt-5 max-w-lg text-xl text-gray-500">
            Upload your data anonymously and compare it to demographics from
            around the world!
          </p>
          {existingProfileQuery.data && (
            <Alert className="mt-4">
              {/* <Terminal className="h-4 w-4" /> */}
              <HeartIcon className="h-4 w-4" />
              <AlertTitle>Welcome back!</AlertTitle>
              <AlertDescription>
                Your last upload was on{" "}
                {existingProfileQuery.data.createdAt.toDateString()}.
                That&apos;s{" "}
                {formatDistanceToNow(
                  existingProfileQuery.data.createdAt.getTime(),
                )}{" "}
                ago.
              </AlertDescription>

              {lastDayOnAppSameAsLastUpload && (
                <AlertDescription>
                  The &quot;last day on app&quot; is the same as last time. No
                  need to upload.
                </AlertDescription>
              )}

              <AlertDescription>
                View your old profile{" "}
                <SLink href={"/insights/" + existingProfileQuery.data.tinderId}>
                  here
                </SLink>
              </AlertDescription>
            </Alert>
          )}

          {/* <CheckboxWithLabel
            id="tos"
            className="mt-5"
            label={
              <span>
                I agree to the{" "}
                <SLink href="/tos" newTab>
                  Terms of Service
                </SLink>
              </span>
            }
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          /> */}
          <div className="mx-auto mt-4 flex  max-w-md justify-center md:mx-0 md:mt-8 md:justify-start">
            <Button
              onClick={uploadProfile}
              loading={existingProfileQuery.isLoading || loading}
              fluid
              disabled={disableUpload}
            >
              {disableUpload
                ? "Confirm your data in the profile card"
                : loading
                  ? "This can take upwards of 20 seconds"
                  : "Upload"}
            </Button>

            {/* <Link href="/insights/" passHref={true}>
              <a className="ml-3 inline-flex rounded-md shadow">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-rose-50">
              Live demo
              </button>
              </a>
            </Link> */}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            By uploading you agree to our{" "}
            <SLink href="/tos" newTab>
              Terms of Service
            </SLink>
          </p>
          {/* <Button
            onClick={() =>
              profileSimulateUploadMutation.mutate(
                props.swipestatsProfilePayload,
              )
            }
            loading={profileSimulateUploadMutation.isLoading || loading}
            fluid
          >
            Simulate
          </Button> */}
        </div>

        <div className="pt-12 sm:pt-0">
          <UploadProfileCard
            swipestatsProfilePayload={props.swipestatsProfilePayload}
            updateProfileGenderData={updateProfileGenderData}
            genderDataAutoUpdated={genderDataAutoUpdated}
            setGenderDataAutoUpdated={setGenderDataAutoUpdated}

            // dataJSON={props.jsonProfile}
          />
        </div>
      </div>
    </div>
  );
}
