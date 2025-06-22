/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { SwipestatsHingeProfilePayload } from "@/lib/interfaces/HingeDataJSON";
import { Badge } from "@/app/_components/ui/badge";
import { format } from "date-fns";

interface HingeUploadProfileCardProps {
  swipestatsHingeProfilePayload: SwipestatsHingeProfilePayload;
}

export function HingeUploadProfileCard({
  swipestatsHingeProfilePayload,
}: HingeUploadProfileCardProps) {
  const _hingeId = swipestatsHingeProfilePayload.hingeId;
  const userData = swipestatsHingeProfilePayload.anonymizedHingeJson.User;
  const prompts =
    swipestatsHingeProfilePayload.anonymizedHingeJson.Prompts || [];
  const matches =
    swipestatsHingeProfilePayload.anonymizedHingeJson.Matches || [];

  const createDate = new Date(userData.account.signup_time);

  // Parse JSON strings if they exist
  const parseJsonField = (field: string | undefined) => {
    if (!field) return [];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(field);
    } catch {
      return [field]; // If it's not JSON, treat as single item
    }
  };

  const ethnicities = parseJsonField(userData.profile.ethnicities);
  const religions = parseJsonField(userData.profile.religions);
  const schools = parseJsonField(userData.profile.schools);
  const hometowns = parseJsonField(userData.profile.hometowns);

  return (
    <div className="relative max-w-xl overflow-hidden rounded bg-white shadow-lg">
      {/* Compact Header */}
      <div className="group flex justify-center rounded-lg bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">
            {userData.profile.gender === "M"
              ? "♂"
              : userData.profile.gender === "F"
                ? "♀"
                : "◦"}
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">
              {userData.profile.gender === "M"
                ? "Man"
                : userData.profile.gender === "F"
                  ? "Woman"
                  : "Person"}
              , {userData.profile.age}
            </div>
            {userData.profile.height_centimeters && (
              <p className="text-sm text-gray-600">
                {userData.profile.height_centimeters}cm (
                {Math.round(userData.profile.height_centimeters / 2.54)}&quot;)
              </p>
            )}
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>{format(createDate, "MMM d, yyyy")}</div>
            <div>{matches.length} matches</div>
          </div>
        </div>

        {/* Dating Info */}
        {(userData.profile.dating_intention ||
          userData.profile.relationship_types) && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {userData.profile.dating_intention && (
                <div>
                  <span className="font-medium text-gray-600">
                    Looking for:
                  </span>
                  <div className="text-gray-800">
                    {userData.profile.dating_intention}
                  </div>
                </div>
              )}
              {userData.profile.relationship_types && (
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <div className="text-gray-800">
                    {userData.profile.relationship_types}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work & Education */}
        {(userData.profile.job_title || schools.length > 0) && (
          <section className="mt-3">
            <h2 className="text-sm font-bold text-gray-700">
              Work & Education
            </h2>
            <div className="mt-1 space-y-1 text-sm">
              {userData.profile.job_title && (
                <div>{userData.profile.job_title}</div>
              )}
              {schools.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {schools.slice(0, 2).map((school: string, index: number) => (
                    <Badge variant="secondary" className="text-xs" key={index}>
                      {school}
                    </Badge>
                  ))}
                  {schools.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{schools.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Location & Lifestyle */}
        <section className="mt-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            {hometowns.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700">From</h3>
                <div className="text-xs text-gray-600">
                  {hometowns[0]}
                  {hometowns.length > 1 && ` +${hometowns.length - 1}`}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            <div>
              <h3 className="text-sm font-bold text-gray-700">Lifestyle</h3>
              <div className="flex flex-wrap gap-1 text-xs">
                {userData.profile.drinking && (
                  <Badge variant="outline" className="text-xs">
                    🍷 {userData.profile.drinking}
                  </Badge>
                )}
                {userData.profile.smoking && (
                  <Badge variant="outline" className="text-xs">
                    🚭 {userData.profile.smoking}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Details */}
        {(userData.profile.children ||
          userData.profile.family_plans ||
          userData.profile.education_attained ||
          userData.profile.politics ||
          ethnicities.length > 0 ||
          religions.length > 0) && (
          <section className="mt-3">
            <h2 className="text-sm font-bold text-gray-700">Details</h2>
            <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
              {userData.profile.education_attained && (
                <div>
                  <span className="font-medium">Education:</span>{" "}
                  {userData.profile.education_attained}
                </div>
              )}
              {userData.profile.children && (
                <div>
                  <span className="font-medium">Children:</span>{" "}
                  {userData.profile.children}
                </div>
              )}
              {userData.profile.family_plans && (
                <div>
                  <span className="font-medium">Family:</span>{" "}
                  {userData.profile.family_plans}
                </div>
              )}
              {userData.profile.politics &&
                userData.profile.politics_displayed && (
                  <div>
                    <span className="font-medium">Politics:</span>{" "}
                    {userData.profile.politics}
                  </div>
                )}
              {ethnicities.length > 0 &&
                userData.profile.ethnicities_displayed && (
                  <div>
                    <span className="font-medium">Ethnicity:</span>{" "}
                    {ethnicities[0]}
                    {ethnicities.length > 1 && ` +${ethnicities.length - 1}`}
                  </div>
                )}
              {religions.length > 0 && userData.profile.religions_displayed && (
                <div>
                  <span className="font-medium">Religion:</span> {religions[0]}
                  {religions.length > 1 && ` +${religions.length - 1}`}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Prompts (compact) */}
        {prompts.length > 0 && (
          <section className="mt-3">
            <h2 className="text-sm font-bold text-gray-700">
              Prompts ({prompts.length})
            </h2>
            <div className="mt-1 space-y-1">
              {prompts.slice(0, 2).map((prompt, index) => (
                <div key={index} className="rounded bg-gray-50 p-2 text-xs">
                  <div className="truncate text-xs font-medium text-gray-600">
                    {prompt.prompt}
                  </div>
                  <div className="mt-0.5 max-h-8 overflow-hidden leading-tight text-gray-800">
                    {prompt.text}
                  </div>
                </div>
              ))}
              {prompts.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{prompts.length - 2} more prompts
                </div>
              )}
            </div>
          </section>
        )}

        {/* Preferences (compact) */}
        <section className="mt-3">
          <h2 className="text-sm font-bold text-gray-700">Looking for</h2>
          <div className="mt-1 text-xs text-gray-600">
            <div>
              {userData.preferences.gender_preference} ages{" "}
              {userData.preferences.age_min}-{userData.preferences.age_max},
              within {userData.preferences.distance_miles_max} miles
            </div>
            {userData.preferences.height_min &&
              userData.preferences.height_max && (
                <div>
                  Height: {userData.preferences.height_min}-
                  {userData.preferences.height_max}cm
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}
