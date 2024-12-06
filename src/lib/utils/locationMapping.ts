import { getCountryForCity } from "./cityMapping";
import { getContinent } from "./countryToContinent";

type LocationType = "city" | "region" | "country";
type FullLocation = {
  city?: string;
  state?: string;
  country: string;
  region?: string;
  continent: string;
}
export function expandLocation(
  location: string,
  type: LocationType,
): FullLocation {

  if (type === "city") {
    const country = getCountryForCity(location);
    const continent = getContinent(country);
    return {
      city: location,
      country,
      continent,
    };
  }
  
  return {} as FullLocation;
}

