// Special profile IDs
export const CREATOR_ID =
  "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5";
export const AVERAGE_MALE_ID = "average-MALE-FEMALE-all";
export const AVERAGE_FEMALE_ID = "average-FEMALE-MALE-all";

// Brand colors
export const BRAND_COLORS = {
  primary: "#ff8a9a", // Rose red
  secondary: "#e51c23",
  gradient: "from-rose-500 to-rose-300",
} as const;

// Chart-specific colors
export const CHART_COLORS = {
  [CREATOR_ID]: {
    line: "#50E3C2", // Teal
    area: "#E0FFF9",
  },
  [AVERAGE_MALE_ID]: {
    line: "#4A90E2", // Blue
    area: "#bfdbfe",
  },
  [AVERAGE_FEMALE_ID]: {
    line: "#EC407A", // Pink
    area: "#fce7f3",
  },
} as const;

// Fallback chart colors
export const FALLBACK_CHART_COLORS = {
  line: ["#e51c23", "#34a853", "#4285F4", "#FBBC05", "#EA4335"],
  area: ["#ff8a9a", "#a6f2c3", "#a1c4fd", "#ffecb3", "#fed3d3"],
} as const;

export const PROFILE_COLORS = {
  // The creator of Swipestats - Teal (unless first profile)
  [CREATOR_ID]: {
    primary: "#50E3C2",
    secondary: "#E0FFF9",
    title: "Creator of Swipestats",
    gradient: "from-teal-400 to-teal-200",
  },
  // Men interested in Women - Cool sapphire blue
  [AVERAGE_MALE_ID]: {
    primary: "#4A90E2",
    secondary: "#bfdbfe",
    title: "Average Man",
    gradient: "from-blue-500 to-blue-300",
  },
  // Women interested in Men - Warm vibrant pink
  [AVERAGE_FEMALE_ID]: {
    primary: "#EC407A",
    secondary: "#fce7f3",
    title: "Average Woman",
    gradient: "from-pink-500 to-pink-300",
  },
} as const;

// Fallback colors for any additional profiles - Following cool/warm pattern
export const FALLBACK_COLORS = {
  primary: [
    "#50E3C2", // Teal (cool)
    "#7B4397", // Deep Purple (cool)
    "#F06292", // Pink (warm)
    "#4DB6AC", // Light Teal (cool)
    "#FF8A65", // Coral (warm)
  ],
  secondary: [
    "#E0FFF9", // Light Teal
    "#E7D9FF", // Light Purple
    "#FFE4EC", // Light Pink
    "#B2EBF2", // Light Cyan
    "#FFE0B2", // Light Coral
  ],
  gradients: [
    "from-teal-400 to-teal-200",
    "from-purple-600 to-purple-300",
    "from-fuchsia-500 to-fuchsia-300",
    "from-cyan-500 to-cyan-300",
    "from-orange-500 to-orange-300",
  ],
} as const;

export function getChartColors(profileId: string, index = 0) {
  // Check if it's a special profile first
  const specialColors = CHART_COLORS[profileId as keyof typeof CHART_COLORS];

  // If this is the first profile (index 0)
  if (index === 0) {
    // For demographic profiles (average man/woman), always use their colors
    if (profileId === AVERAGE_MALE_ID || profileId === AVERAGE_FEMALE_ID) {
      return specialColors;
    }
    // For creator or regular profiles, use brand colors
    return {
      line: BRAND_COLORS.primary,
      area: BRAND_COLORS.secondary,
    };
  }

  // If it's a special profile, return its colors
  if (specialColors) return specialColors;

  // Fallback to cycling through fallback colors
  return {
    line: FALLBACK_CHART_COLORS.line[
      index % FALLBACK_CHART_COLORS.line.length
    ]!,
    area: FALLBACK_CHART_COLORS.area[
      index % FALLBACK_CHART_COLORS.area.length
    ]!,
  };
}

export function getProfileColors(profileId: string, index = 0) {
  // Check if it's a special profile first
  const specialColors =
    PROFILE_COLORS[profileId as keyof typeof PROFILE_COLORS];

  // If this is the first profile (index 0)
  if (index === 0) {
    // For demographic profiles (average man/woman), always use their colors
    if (profileId === AVERAGE_MALE_ID || profileId === AVERAGE_FEMALE_ID) {
      return specialColors;
    }
    // For creator or regular profiles, use brand colors (but keep special title)
    return {
      primary: BRAND_COLORS.primary,
      secondary: BRAND_COLORS.secondary,
      gradient: BRAND_COLORS.gradient,
      title: specialColors?.title,
    };
  }

  // If it's a special profile, return its colors
  if (specialColors) return specialColors;

  // Fallback to cycling through fallback colors
  return {
    primary: FALLBACK_COLORS.primary[index % FALLBACK_COLORS.primary.length]!,
    secondary:
      FALLBACK_COLORS.secondary[index % FALLBACK_COLORS.secondary.length]!,
    gradient:
      FALLBACK_COLORS.gradients[index % FALLBACK_COLORS.gradients.length]!,
  };
}

export function getProfileGradientClasses(
  profileId: string,
  index = 0,
): string {
  return getProfileColors(profileId, index).gradient;
}

export function getTailwindGradientClasses(
  profileId: string,
  index = 0,
): string {
  return getProfileColors(profileId, index).gradient;
}

export function getProfileIconColor(profileId: string, index = 0): string {
  return getProfileColors(profileId, index).primary;
}

export function getProfileTitle(
  profileId: string,
  index = 0,
): string | undefined {
  return getProfileColors(profileId, index).title;
}
