type Uppercase = string;
type CountryCode = `${Uppercase}${Uppercase}`;
type Continent =
  | "North America"
  | "South America"
  | "Europe"
  | "Asia"
  | "Africa"
  | "Oceania"
  | "Antarctica";

const countryCodeToContinentMap: Record<string, Continent> = {
  // North America
  US: "North America",
  CA: "North America",
  MX: "North America",
  // ... existing code ...

  // South America
  AR: "South America",
  BR: "South America",
  CL: "South America",
  EC: "South America",
  UY: "South America",
  VE: "South America",

  // Europe
  AT: "Europe", // Austria
  BE: "Europe", // Belgium
  BG: "Europe", // Bulgaria
  CH: "Europe", // Switzerland
  CY: "Europe", // Cyprus
  CZ: "Europe", // Czech Republic
  DE: "Europe", // Germany
  DK: "Europe", // Denmark
  EE: "Europe", // Estonia
  ES: "Europe", // Spain
  FI: "Europe", // Finland
  FR: "Europe", // France
  GB: "Europe", // United Kingdom
  GR: "Europe", // Greece
  HR: "Europe", // Croatia
  HU: "Europe", // Hungary
  IE: "Europe", // Ireland
  IS: "Europe", // Iceland
  IT: "Europe", // Italy
  LT: "Europe", // Lithuania
  LU: "Europe", // Luxembourg
  LV: "Europe", // Latvia
  MT: "Europe", // Malta
  NL: "Europe", // Netherlands
  NO: "Europe", // Norway
  PL: "Europe", // Poland
  PT: "Europe", // Portugal
  RO: "Europe", // Romania
  SE: "Europe", // Sweden
  SI: "Europe", // Slovenia
  SK: "Europe", // Slovakia

  // Asia
  CN: "Asia", // China
  HK: "Asia", // Hong Kong
  ID: "Asia", // Indonesia
  IN: "Asia", // India
  JP: "Asia", // Japan
  KH: "Asia", // Cambodia
  KR: "Asia", // South Korea
  LA: "Asia", // Laos
  MM: "Asia", // Myanmar
  MY: "Asia", // Malaysia
  PH: "Asia", // Philippines
  SG: "Asia", // Singapore
  TH: "Asia", // Thailand
  TW: "Asia", // Taiwan
  VN: "Asia", // Vietnam
  BN: "Asia", // Brunei
  KZ: "Asia", // Kazakhstan
  KG: "Asia", // Kyrgyzstan
  MN: "Asia", // Mongolia
  NP: "Asia", // Nepal
  PK: "Asia", // Pakistan
  LK: "Asia", // Sri Lanka
  TJ: "Asia", // Tajikistan
  TM: "Asia", // Turkmenistan
  UZ: "Asia", // Uzbekistan
  AE: "Asia", // United Arab Emirates
  BH: "Asia", // Bahrain
  IL: "Asia", // Israel
  IQ: "Asia", // Iraq
  IR: "Asia", // Iran
  JO: "Asia", // Jordan
  KW: "Asia", // Kuwait
  LB: "Asia", // Lebanon
  OM: "Asia", // Oman
  QA: "Asia", // Qatar
  SA: "Asia", // Saudi Arabia
  SY: "Asia", // Syria
  TR: "Asia", // Turkey
  YE: "Asia", // Yemen

  // Oceania
  AU: "Oceania",
  NZ: "Oceania",

  // Africa
  EG: "Africa",
  ET: "Africa",
  KE: "Africa",
  NG: "Africa",
  ZA: "Africa",
};

// caters for country names in different languages
const countryNameToCodeMap: Record<string, CountryCode> = {
  "United States": "US",
  Canada: "CA",
  Mexico: "MX",
  "Costa Rica": "CR",
  "Dominican Republic": "DO",

  Argentina: "AR",
  Brazil: "BR",
  Chile: "CL",
  Ecuador: "EC",
  Uruguay: "UY",
  Venezuela: "VE",

  Austria: "AT",
  Belgium: "BE",
  Bulgaria: "BG",
  Croatia: "HR",
  Cyprus: "CY",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Estonia: "EE",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  Hungary: "HU",
  Iceland: "IS",
  Ireland: "IE",
  Italy: "IT",
  Netherlands: "NL",
  Poland: "PL",
  Portugal: "PT",
  Spain: "ES",
  Sweden: "SE",
  Switzerland: "CH",
  "United Kingdom": "GB",

  China: "CN",
  "Hong Kong": "HK",
  India: "IN",
  Indonesia: "ID",
  Japan: "JP",
  Malaysia: "MY",
  Philippines: "PH",
  Singapore: "SG",
  "South Korea": "KR",
  Taiwan: "TW",
  Thailand: "TH",
  "United Arab Emirates": "AE",

  Australia: "AU",
  "New Zealand": "NZ",

  Egypt: "EG",
  Ethiopia: "ET",
  Kenya: "KE",
  Nigeria: "NG",
  "South Africa": "ZA",
};

export function getContinent(country: CountryCode): string | undefined {
  // First check if the input is a country code
  if (countryCodeToContinentMap[country]) {
    return countryCodeToContinentMap[country];
  }

  // If not found, check if it's a country name and convert to code
  const countryCode = countryNameToCodeMap[country];
  return countryCode ? countryCodeToContinentMap[countryCode] : undefined;
}
