import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { HingeInsightsClient } from "./HingeInsightsClient";

export default async function HingeInsightsPage(props: {
  params: Promise<{ hingeId: string }>;
}) {
  const hingeId = (await props.params).hingeId;

  const hingeProfile = await db.hingeProfile.findUnique({
    where: {
      hingeId,
    },
    include: {
      prompts: true,
      customData: true,
      user: {
        select: {
          id: true,
          timeZone: true,
          country: true,
        },
      },
    },
  });

  if (!hingeProfile) {
    notFound();
  }

  // Calculate some basic stats server-side
  const age = hingeProfile.ageAtUpload;
  const heightInFeet = Math.floor(hingeProfile.heightCentimeters / 30.48);
  const heightInInches = Math.round(
    (hingeProfile.heightCentimeters / 2.54) % 12,
  );
  const promptCount = hingeProfile.prompts.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-xl font-bold text-white">
              H
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hinge Insights
              </h1>
              <p className="text-gray-600">Your dating data analyzed</p>
            </div>
          </div>
        </div>

        {/* Client-side Dynamic Content (chart & more) */}
        <HingeInsightsClient hingeId={hingeId} />

        {/* Prompts Section */}
        {hingeProfile.prompts.length > 0 && (
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">
              Your Prompts
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hingeProfile.prompts.slice(0, 6).map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-lg border bg-gray-50 p-5 transition-all hover:bg-gray-100"
                >
                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    {prompt.prompt}
                  </p>
                  <p className="text-base text-gray-900">{prompt.answerText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Profile Info Cards */}
        <div className="mb-8 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Age</p>
                <p className="text-2xl font-bold text-gray-900">{age}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                🎂
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Height</p>
                <p className="text-2xl font-bold text-gray-900">
                  {`${heightInFeet}'${heightInInches}"`}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                📏
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gender</p>
                <p className="text-2xl font-bold capitalize text-gray-900">
                  {hingeProfile.gender.toLowerCase()}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                👤
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prompts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promptCount}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <span className="text-lg">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle Choices Section */}
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-gray-900">
            Lifestyle Choices
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center rounded-lg bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.smoking ? "✅" : "❌"}
              </div>
              <p className="font-semibold text-gray-900">Smoking</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.smokingDisplayed ? "Displayed" : "Hidden"}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.drinking ? "✅" : "❌"}
              </div>
              <p className="font-semibold text-gray-900">Drinking</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.drinkingDisplayed ? "Displayed" : "Hidden"}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.marijuana ? "✅" : "❌"}
              </div>
              <p className="font-semibold text-gray-900">Marijuana</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.marijuanaDisplayed ? "Displayed" : "Hidden"}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.drugs ? "✅" : "❌"}
              </div>
              <p className="font-semibold text-gray-900">Drugs</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.drugsDisplayed ? "Displayed" : "Hidden"}
              </p>
            </div>
          </div>
        </div>

        {/* Looking For & Family Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Looking For
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Gender Preference
                </p>
                <p className="text-lg font-medium capitalize text-gray-900">
                  {hingeProfile.genderPreference}
                </p>
              </div>
              {hingeProfile.datingIntention && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Dating Intention
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.datingIntention}
                  </p>
                </div>
              )}
              {hingeProfile.relationshipType && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Relationship Type
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.relationshipType}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Family & Future
            </h3>
            <div className="space-y-4">
              {hingeProfile.children && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Children</p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.children}
                  </p>
                </div>
              )}
              {hingeProfile.familyPlans && (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Family Plans
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.familyPlans}
                  </p>
                </div>
              )}
              {hingeProfile.politics && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Politics</p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.politics}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dealbreakers Section */}
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-gray-900">
            Dealbreakers
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.ageDealbreaker ? "❌" : "✅"}
              </div>
              <p className="font-semibold text-gray-900">Age</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.ageDealbreaker ? "Strict" : "Flexible"}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.heightDealbreaker ? "❌" : "✅"}
              </div>
              <p className="font-semibold text-gray-900">Height</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.heightDealbreaker ? "Strict" : "Flexible"}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
              <div className="mb-3 text-4xl">
                {hingeProfile.ethnicityDealbreaker ? "❌" : "✅"}
              </div>
              <p className="font-semibold text-gray-900">Ethnicity</p>
              <p className="text-sm text-gray-600">
                {hingeProfile.ethnicityDealbreaker ? "Strict" : "Flexible"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Work & Education */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Work & Education
            </h3>
            <div className="space-y-4">
              {hingeProfile.jobTitle && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Title</p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.jobTitle}
                  </p>
                </div>
              )}
              {hingeProfile.educationAttained && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Education</p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.educationAttained}
                  </p>
                </div>
              )}
              {hingeProfile.schoolsOriginal.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Schools</p>
                  <div className="flex flex-wrap gap-2">
                    {hingeProfile.schoolsOriginal
                      .slice(0, 3)
                      .map((school, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                        >
                          {school}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Personal Details
            </h3>
            <div className="space-y-4">
              {hingeProfile.ethnicities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Ethnicity</p>
                  <div className="flex flex-wrap gap-2">
                    {hingeProfile.ethnicities
                      .slice(0, 3)
                      .map((ethnicity, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
                        >
                          {ethnicity}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {hingeProfile.religions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Religion</p>
                  <div className="flex flex-wrap gap-2">
                    {hingeProfile.religions.slice(0, 2).map((religion, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                      >
                        {religion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hingeProfile.hometowns.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Hometown</p>
                  <p className="text-lg font-medium text-gray-900">
                    {hingeProfile.hometowns[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
