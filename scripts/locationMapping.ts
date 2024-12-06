import { PrismaClient } from "@prisma/client";
import { processDemographics } from "./demographicHelpers";

const unmappedLocations = {
  regions: new Set<string>(),
  cities: new Set<string>(),
};

function getCountryAndContinentForRegion(
  region: string,
  currentCountry?: string,
): { country: string; continent?: string } {
  // Basic mapping of regions to countries and continents
  const regionMappings: Record<string, { country: string; continent: string }> =
    {
      // US States
      AB: { country: "Canada", continent: "North America" },
      AK: { country: "United States", continent: "North America" },
      AL: { country: "United States", continent: "North America" },
      AR: { country: "United States", continent: "North America" },
      AZ: { country: "United States", continent: "North America" },
      CA: { country: "United States", continent: "North America" },
      CO: { country: "United States", continent: "North America" },
      CT: { country: "United States", continent: "North America" },
      DC: { country: "United States", continent: "North America" },
      DE: { country: "United States", continent: "North America" },
      FL: { country: "United States", continent: "North America" },

      // European Regions
      Aargau: { country: "Switzerland", continent: "Europe" },
      Andalucía: { country: "Spain", continent: "Europe" },
      Andalusia: { country: "Spain", continent: "Europe" },
      Antwerpen: { country: "Belgium", continent: "Europe" },
      Aragón: { country: "Spain", continent: "Europe" },
      Assia: { country: "Germany", continent: "Europe" },
      Athens: { country: "Greece", continent: "Europe" },
      "Auvergne-Rhône-Alpes": { country: "France", continent: "Europe" },
      Azores: { country: "Portugal", continent: "Europe" },
      "Baden-Württemberg": { country: "Germany", continent: "Europe" },
      "Balearic Isles": { country: "Spain", continent: "Europe" },
      "Balearische Inseln": { country: "Spain", continent: "Europe" },
      Bavaria: { country: "Germany", continent: "Europe" },
      Bayern: { country: "Germany", continent: "Europe" },
      Berlin: { country: "Germany", continent: "Europe" },
      "Brabant wallon": { country: "Belgium", continent: "Europe" },
      Brandenburg: { country: "Germany", continent: "Europe" },
      Bretagne: { country: "France", continent: "Europe" },
      "British Columbia": { country: "Canada", continent: "North America" },
      Budapest: { country: "Hungary", continent: "Europe" },
      Campania: { country: "Italy", continent: "Europe" },
      Catalunya: { country: "Spain", continent: "Europe" },
      Cataluña: { country: "Spain", continent: "Europe" },
      Corse: { country: "France", continent: "Europe" },
      "Co. Dublin": { country: "Ireland", continent: "Europe" },
      "Co. Wexford": { country: "Ireland", continent: "Europe" },
      "Community of Madrid": { country: "Spain", continent: "Europe" },
      "Comunidad de Madrid": { country: "Spain", continent: "Europe" },
      "County Dublin": { country: "Ireland", continent: "Europe" },
      "County Kerry": { country: "Ireland", continent: "Europe" },
      "County Kildare": { country: "Ireland", continent: "Europe" },
      Cádiz: { country: "Spain", continent: "Europe" },
      Dolnośląskie: { country: "Poland", continent: "Europe" },
      "Emilia-Romagna": { country: "Italy", continent: "Europe" },
      England: { country: "United Kingdom", continent: "Europe" },
      "Etelä-Karjala": { country: "Finland", continent: "Europe" },
      "Etelä-Savo": { country: "Finland", continent: "Europe" },

      // Countries (when they appear as regions)
      Argentina: { country: "Argentina", continent: "South America" },
      Australia: { country: "Australia", continent: "Oceania" },
      Austria: { country: "Austria", continent: "Europe" },
      Belgium: { country: "Belgium", continent: "Europe" },
      België: { country: "Belgium", continent: "Europe" },
      Belgique: { country: "Belgium", continent: "Europe" },
      "Bosnia and Herzegovina": {
        country: "Bosnia and Herzegovina",
        continent: "Europe",
      },
      Brasil: { country: "Brazil", continent: "South America" },
      Brazil: { country: "Brazil", continent: "South America" },
      Bulgaria: { country: "Bulgaria", continent: "Europe" },
      Canada: { country: "Canada", continent: "North America" },
      Chile: { country: "Chile", continent: "South America" },
      China: { country: "China", continent: "Asia" },
      "Costa Rica": { country: "Costa Rica", continent: "North America" },
      Croatia: { country: "Croatia", continent: "Europe" },
      Cyprus: { country: "Cyprus", continent: "Europe" },
      Czechia: { country: "Czech Republic", continent: "Europe" },
      Danmark: { country: "Denmark", continent: "Europe" },
      Denmark: { country: "Denmark", continent: "Europe" },
      Deutschland: { country: "Germany", continent: "Europe" },
      "Dominican Republic": {
        country: "Dominican Republic",
        continent: "North America",
      },
      Ecuador: { country: "Ecuador", continent: "South America" },
      Estonia: { country: "Estonia", continent: "Europe" },
      España: { country: "Spain", continent: "Europe" },
      Ethiopia: { country: "Ethiopia", continent: "Africa" },
      Finland: { country: "Finland", continent: "Europe" },
      France: { country: "France", continent: "Europe" },

      // Special Administrative Regions
      CDMX: { country: "Mexico", continent: "North America" },
      CABA: { country: "Argentina", continent: "South America" },
      Dubai: { country: "United Arab Emirates", continent: "Asia" },
      "Capital Region": { country: "Iceland", continent: "Europe" },
      "City of Zagreb": { country: "Croatia", continent: "Europe" },
      "Distrito Capital": { country: "Venezuela", continent: "South America" },
      "District of Columbia": {
        country: "United States",
        continent: "North America",
      },
      "Departamento de Montevideo": {
        country: "Uruguay",
        continent: "South America",
      },
    };

  const mapping = regionMappings[region];
  if (mapping) {
    return mapping;
  }

  // Track unmapped regions
  unmappedLocations.regions.add(region);
  console.log(`Unmapped region found: ${region}`);

  // If no mapping found, return current country if available
  return {
    country: currentCountry || "Unknown",
    continent: undefined,
  };
}

function getCountryForCity(
  city: string,
  currentCountry?: string,
): string | undefined {
  // Basic mapping of cities to countries
  const cityMappings: Record<string, string> = {
    "New York": "United States",
    "Los Angeles": "United States",
    Toronto: "Canada",
    Sydney: "Australia",
    // Add more mappings as needed
  };

  const country = cityMappings[city] || currentCountry;

  if (!cityMappings[city]) {
    unmappedLocations.cities.add(city);
    console.log(`Unmapped city found: ${city}`);
  }

  return country;
}

const prisma = new PrismaClient();

await processDemographics(true, async (params) => {
  console.log(params);

  const profiles = await prisma.tinderProfile.findMany({
    where: {
      gender: params.gender,
      interestedIn: params.interestedIn,
    },
    select: {
      city: true,
      country: true,
      region: true,
    },
  });

  // Updated location counts structure
  const locationCounts = {
    countries: {} as Record<string, number>,
    regions: {} as Record<string, number>,
    continents: {} as Record<string, number>,
    cities: {} as Record<string, number>,
  };

  profiles.forEach((profile) => {
    if (profile.country) {
      locationCounts.countries[profile.country] =
        (locationCounts.countries[profile.country] ?? 0) + 1;
    }

    if (profile.region) {
      // Map region to continent and country
      const { country, continent } = getCountryAndContinentForRegion(
        profile.region,
        profile.country,
      );

      locationCounts.regions[profile.region] =
        (locationCounts.regions[profile.region] ?? 0) + 1;

      if (continent) {
        locationCounts.continents[continent] =
          (locationCounts.continents[continent] ?? 0) + 1;
      }
    }

    if (profile.city) {
      const country = getCountryForCity(profile.city, profile.country);
      if (country) {
        locationCounts.countries[country] =
          (locationCounts.countries[country] ?? 0) + 1;
      }

      locationCounts.cities[profile.city] =
        (locationCounts.cities[profile.city] ?? 0) + 1;
    }
  });

  // Add continent sorting
  const topContinents = Object.entries(locationCounts.continents)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Sort by count and get top locations
  const topCountries = Object.entries(locationCounts.countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const topRegions = Object.entries(locationCounts.regions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const topCities = Object.entries(locationCounts.cities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.log("\nTop 10 Countries:");
  console.log(JSON.stringify(topCountries, null, 2));

  console.log("\nTop 10 Regions:");
  console.log(JSON.stringify(topRegions, null, 2));

  console.log("\nTop 10 Cities:");
  console.log(JSON.stringify(topCities, null, 2));

  console.log("\nTop 10 Continents:");
  console.log(JSON.stringify(topContinents, null, 2));

  // Calculate percentages
  const totalProfiles = profiles.length;
  const profilesWithLocation = profiles.filter(
    (p) => p.country || p.region || p.city,
  ).length;

  console.log(`\nTotal profiles: ${totalProfiles}`);
  console.log(
    `Profiles with location data: ${profilesWithLocation} (${((profilesWithLocation / totalProfiles) * 100).toFixed(1)}%)`,
  );

  console.log("\nUnmapped Locations Summary:");
  console.log("\nUnmapped Regions:");
  Array.from(unmappedLocations.regions)
    .sort()
    .forEach((region) => console.log(`- ${region}`));

  console.log("\nUnmapped Cities:");
  Array.from(unmappedLocations.cities)
    .sort()
    .forEach((city) => console.log(`- ${city}`));

  console.log();
});
