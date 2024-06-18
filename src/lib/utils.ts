import type { TinderProfile } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type TinderJsonGender } from "./interfaces/TinderDataJSON";
import { differenceInYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Radash omit, but ended up just importing the library
// export const omit = <T, TKeys extends keyof T>(
//   obj: T,
//   keys: TKeys[]
// ): Omit<T, TKeys> => {
//   if (!obj) return {} as Omit<T, TKeys>
//   if (!keys || keys.length === 0) return obj as Omit<T, TKeys>
//   return keys.reduce(
//     (acc, key) => {
//       // Gross, I know, it's mutating the object, but we
//       // are allowing it in this very limited scope due
//       // to the performance implications of an omit func.
//       // Not a pattern or practice to use elsewhere.
//       delete acc[key]
//       return acc
//     },
//     { ...obj }
//   )
// }

export function getISOMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function getISODayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getLabelForTinderProfile(tinderProfile: TinderProfile) {
  return (
    tinderProfile.gender +
    ", " +
    differenceInYears(new Date(), new Date(tinderProfile.birthDate))
  );
}

export function getRandomSubarray<T>(arr: T[], size: number): T[] {
  // Create a copy of the original array to avoid modifying it
  const shuffled = arr.slice();
  const n = shuffled.length;

  // Fisher-Yates (Durstenfeld) shuffle algorithm for efficiency and simplicity
  for (let i = n - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex]!,
      shuffled[i]!,
    ]; // Swap elements
  }

  // Return a subarray of the desired size
  return shuffled.slice(0, size);
}

export async function createSHA256Hash(str: string) {
  const utf8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function isGenderDataUnknown(gender: TinderJsonGender) {
  switch (gender) {
    case "Unknown":
      return true;
    case "M":
      return false;
    case "F":
      return false;
    default:
      return true;
  }
}

export function getGenderDisplay(gender: TinderJsonGender) {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    case "More":
      return "More";
    case "Unknown":
      return "Unknown";
    case "Other":
      return "Other";
    default:
      return "Unknown";
  }
}
