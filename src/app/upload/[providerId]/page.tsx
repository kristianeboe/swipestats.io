"use client";
import { useState, useEffect, type FormEvent, use } from "react";

import { UploadArea } from "./UploadArea";

import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

import Link from "next/link";

import Head from "next/head";

import { cn } from "@/lib/utils";
import type { SwipestatsProfilePayload } from "@/lib/interfaces/TinderDataJSON";

import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import type { DataProvider } from "@prisma/client";
import { StepHeader } from "./StepHeader";
import { UploadCTA } from "./UploadCTA";
import { createSwipestatsProfilePayloadFromJson } from "./extractAnonymizedData";
import { Input } from "@/app/_components/ui/input";
import DataRequestSupport from "@/app/DataRequestSupport";
import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";
import { usePostHog } from "posthog-js/react";

// import testData from '../../fixtures/kristian-data.json';

const dataProviders = [
  {
    id: "TINDER",
    title: "Tinder",
    description: "The world's most popular dating app.", //, making it the place to meet new people.",
  },
  {
    id: "HINGE",
    title: "Hinge",
    description: "The dating app designed to be deleted.", // Hinge is built on the belief that anyone looking for love should be able to find it.',
  },
  {
    id: "BUMBLE",
    title: "Bumble",
    description: "Women make the first move.", // 'Bumble has changed the way people date, find friends, and the perception of meeting online, for the better. Women make the first move.',
  },
] as const;

// Return a list of `params` to populate the [slug] dynamic segment
// export async function generateStaticParams() {
//   return dataProviders.map((provider) => ({
//     slug: provider.id.toLowerCase(),
//   }));
// }

export default function UploadPage(props: {
  params: Promise<{ providerId: "tinder" | "hinge" | "bumble" }>;
}) {
  const params = use(props.params);
  const posthog = usePostHog();
  const [swipestatsProfilePayload, setSwipestatsProfilePayload] =
    useState<SwipestatsProfilePayload | null>(null);

  function updateProfilePayload(
    partialProfile: Partial<SwipestatsProfilePayload["anonymizedTinderJson"]>,
  ) {
    if (!swipestatsProfilePayload) {
      console.error("Profile not initialized yet");
      return;
    }
    setSwipestatsProfilePayload({
      tinderId: swipestatsProfilePayload.tinderId,
      anonymizedTinderJson: {
        ...swipestatsProfilePayload.anonymizedTinderJson,
        ...partialProfile,
      },
    });
  }

  const routerProvider = dataProviders.find(
    (p) => p.id === (params.providerId.toUpperCase() as DataProvider),
  );
  const [selectedDataProvider, setDataProvider] = useState(
    routerProvider ?? dataProviders[0],
  );

  if (routerProvider && routerProvider.id !== selectedDataProvider.id) {
    setDataProvider(routerProvider); // TODO rethink
  }

  async function onAcceptedFileLoad(data: string) {
    try {
      const payload = await createSwipestatsProfilePayloadFromJson(
        data,
        selectedDataProvider.id,
      );
      setSwipestatsProfilePayload(payload);
      posthog.identify(payload.tinderId);

      analyticsTrackClient("Profile Anonymised Successfully", {
        tinderId: payload.tinderId,
        providerId: selectedDataProvider.id,
      });
    } catch (error) {
      console.error(error);
      analyticsTrackClient("Profile Anonymised Failed", {
        providerId: selectedDataProvider.id,
      });
    }
  }

  return (
    <div>
      <Head>
        <title>
          Upload your {selectedDataProvider.title} data | Swipestats
        </title>
        <meta
          name="description"
          content={`Upload your ${selectedDataProvider.title} data anonymously and compare it to demographics from around the world!`}
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={"https://swipestats.io/upload/" + selectedDataProvider.id}
        />
        <meta
          property="og:title"
          content="Swipestats | Visualize your Tinder data"
        />
        <meta
          property="og:description"
          content="Upload your dating data anonymously and compare it to demographics from around the world!"
        />
        <meta property="og:image" content="/ss2.png" />
      </Head>
      <StepHeader />
      <div className="min-h-screen">
        <div>
          {!swipestatsProfilePayload && (
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold uppercase tracking-wide text-rose-600">
                  Upload
                </h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  Visualize your {selectedDataProvider.title} data
                </p>
                <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
                  Upload your data anonymously and compare it to demographics
                  from around the world!
                </p>
              </div>

              <RadioGroup
                value={selectedDataProvider}
                onChange={setDataProvider}
              >
                <RadioGroup.Label className="sr-only text-base font-medium text-gray-900">
                  Select a data provider
                </RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  {dataProviders.map((dataProvider) => (
                    <Link
                      key={dataProvider.id}
                      href={`/upload/${dataProvider.id.toLowerCase()}/`}
                    >
                      <RadioGroup.Option
                        value={dataProvider}
                        className={({ checked, active }) =>
                          cn(
                            checked ? "border-transparent" : "border-gray-300",
                            active ? "ring-2 ring-rose-500" : "",
                            "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none",
                          )
                        }
                      >
                        {({ checked, active }) => (
                          <>
                            <div className="flex flex-1">
                              <div className="flex flex-col">
                                <RadioGroup.Label
                                  as="span"
                                  className="block text-sm font-medium text-gray-900"
                                >
                                  {dataProvider.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-1 flex items-center text-sm text-gray-500"
                                >
                                  {dataProvider.description}
                                </RadioGroup.Description>
                              </div>
                            </div>
                            <CheckCircleIcon
                              className={cn(
                                !checked ? "invisible" : "",
                                "h-5 w-5 text-rose-600",
                              )}
                              aria-hidden="true"
                            />
                            <div
                              className={cn(
                                active ? "border" : "border-2",
                                checked
                                  ? "border-rose-500"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-lg",
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    </Link>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {selectedDataProvider.title === "Tinder" ? (
          <div className="">
            <div className="flex flex-col items-center justify-center">
              {swipestatsProfilePayload ? (
                <UploadCTA
                  swipestatsProfilePayload={swipestatsProfilePayload}
                  updateProfilePayload={updateProfilePayload}
                />
              ) : (
                <>
                  <UploadArea
                    dataProviderId={selectedDataProvider.id}
                    onAcceptedFileLoad={onAcceptedFileLoad}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <WaitlistCTA dataProvider={selectedDataProvider} />
        )}
      </div>
    </div>
  );
}

function WaitlistCTA({
  dataProvider,
}: {
  dataProvider: (typeof dataProviders)[number];
}) {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"" | "success" | "error">("");
  const [loading, setLoading] = useState(false);

  const subscribeToWaitlistMutation =
    api.profile.subscribeToWaitlist.useMutation({
      onSuccess() {
        setFormStatus("success");
        setLoading(false);
      },
      onError() {
        setFormStatus("error");
      },
    });

  useEffect(() => {
    setFormStatus("");
  }, [dataProvider]);

  function addEmailToWaitlist(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    subscribeToWaitlistMutation.mutate({
      dataProviderId: dataProvider.id,
      email,
    });
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-rose-700 px-6 py-10 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-20">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {dataProvider.title} is not available yet
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-rose-100">
              But we are working on it! Leave your email here to get notified
              when we support them!
            </p>
          </div>
          <div className="mt-12 sm:w-full sm:max-w-md lg:ml-8 lg:mt-0 lg:flex-1">
            {formStatus ? (
              formStatus === "error" ? (
                <div> Error</div>
              ) : (
                // <p className="text-rose-100">Email saved</p>
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Thanks we&apos;ll let you know 🎉
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <form className="gap-2 sm:flex" onSubmit={addEmailToWaitlist}>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>

                <Input
                  disabled={loading}
                  id="email-address"
                  name="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button loading={loading} type="submit">
                  Notify me
                </Button>
              </form>
            )}

            <p className="mt-3 text-sm text-rose-100">
              We care about the protection of your data. Read our{" "}
              <Link
                href="/privacy"
                className="font-medium text-white underline"
              >
                Privacy Policy.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
