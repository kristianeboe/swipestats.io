type Continent = "NA" | "SA" | "EU" | "AS" | "AF" | "OC" | "AN";

export const continentMap: Record<Continent, string> = {
  NA: "North America",
  SA: "South America",
  EU: "Europe",
  AS: "Asia",
  AF: "Africa",
  OC: "Oceania",
  AN: "Antarctica",
};

const countryCodeToContinentMap = {
  // Africa (AF)
  DZ: "AF", // Algeria
  AO: "AF", // Angola
  BJ: "AF", // Benin
  BW: "AF", // Botswana
  BF: "AF", // Burkina Faso
  BI: "AF", // Burundi
  CV: "AF", // Cabo Verde
  CM: "AF", // Cameroon
  CF: "AF", // Central African Republic
  TD: "AF", // Chad
  KM: "AF", // Comoros
  CG: "AF", // Congo (Republic of)
  CD: "AF", // Congo (Democratic Republic of)
  CI: "AF", // Côte d'Ivoire
  DJ: "AF", // Djibouti
  EG: "AF", // Egypt
  GQ: "AF", // Equatorial Guinea
  ER: "AF", // Eritrea
  SZ: "AF", // Eswatini
  ET: "AF", // Ethiopia
  GA: "AF", // Gabon
  GM: "AF", // Gambia
  GH: "AF", // Ghana
  GN: "AF", // Guinea
  GW: "AF", // Guinea-Bissau
  KE: "AF", // Kenya
  LS: "AF", // Lesotho
  LR: "AF", // Liberia
  LY: "AF", // Libya
  MG: "AF", // Madagascar
  MW: "AF", // Malawi
  ML: "AF", // Mali
  MR: "AF", // Mauritania
  MU: "AF", // Mauritius
  MA: "AF", // Morocco
  MZ: "AF", // Mozambique
  NA: "AF", // Namibia
  NE: "AF", // Niger
  NG: "AF", // Nigeria
  RW: "AF", // Rwanda
  ST: "AF", // Sao Tome and Principe
  SN: "AF", // Senegal
  SC: "AF", // Seychelles
  SL: "AF", // Sierra Leone
  SO: "AF", // Somalia
  ZA: "AF", // South Africa
  SS: "AF", // South Sudan
  SD: "AF", // Sudan
  TZ: "AF", // Tanzania
  TG: "AF", // Togo
  TN: "AF", // Tunisia
  UG: "AF", // Uganda
  ZM: "AF", // Zambia
  ZW: "AF", // Zimbabwe

  // Asia (AS)
  AF: "AS", // Afghanistan
  AM: "AS", // Armenia
  AZ: "AS", // Azerbaijan
  BH: "AS", // Bahrain
  BD: "AS", // Bangladesh
  BT: "AS", // Bhutan
  BN: "AS", // Brunei
  KH: "AS", // Cambodia
  CN: "AS", // China
  GE: "AS", // Georgia
  HK: "AS", // Hong Kong (SAR China)
  IN: "AS", // India
  ID: "AS", // Indonesia
  IR: "AS", // Iran
  IQ: "AS", // Iraq
  IL: "AS", // Israel
  JP: "AS", // Japan
  JO: "AS", // Jordan
  KZ: "AS", // Kazakhstan
  KW: "AS", // Kuwait
  KG: "AS", // Kyrgyzstan
  LA: "AS", // Laos
  LB: "AS", // Lebanon
  MO: "AS", // Macau (SAR China)
  MY: "AS", // Malaysia
  MV: "AS", // Maldives
  MN: "AS", // Mongolia
  MM: "AS", // Myanmar
  NP: "AS", // Nepal
  KP: "AS", // North Korea
  OM: "AS", // Oman
  PK: "AS", // Pakistan
  PS: "AS", // Palestine
  PH: "AS", // Philippines
  QA: "AS", // Qatar
  SA: "AS", // Saudi Arabia
  SG: "AS", // Singapore
  KR: "AS", // South Korea
  LK: "AS", // Sri Lanka
  SY: "AS", // Syria
  TW: "AS", // Taiwan
  TJ: "AS", // Tajikistan
  TH: "AS", // Thailand
  TL: "AS", // Timor-Leste
  TR: "AS", // Turkey
  TM: "AS", // Turkmenistan
  AE: "AS", // United Arab Emirates
  UZ: "AS", // Uzbekistan
  VN: "AS", // Vietnam
  YE: "AS", // Yemen

  // Europe (EU)
  AL: "EU", // Albania
  AD: "EU", // Andorra
  AT: "EU", // Austria
  BY: "EU", // Belarus
  BE: "EU", // Belgium
  BA: "EU", // Bosnia and Herzegovina
  BG: "EU", // Bulgaria
  HR: "EU", // Croatia
  CY: "EU", // Cyprus
  CZ: "EU", // Czech Republic
  DK: "EU", // Denmark
  EE: "EU", // Estonia
  FI: "EU", // Finland
  FR: "EU", // France
  DE: "EU", // Germany
  GR: "EU", // Greece
  HU: "EU", // Hungary
  IS: "EU", // Iceland
  IE: "EU", // Ireland
  IT: "EU", // Italy
  XK: "EU", // Kosovo (partially recognized, unofficial ISO code)
  LV: "EU", // Latvia
  LI: "EU", // Liechtenstein
  LT: "EU", // Lithuania
  LU: "EU", // Luxembourg
  MT: "EU", // Malta
  MD: "EU", // Moldova
  MC: "EU", // Monaco
  ME: "EU", // Montenegro
  NL: "EU", // Netherlands
  MK: "EU", // North Macedonia
  NO: "EU", // Norway
  PL: "EU", // Poland
  PT: "EU", // Portugal
  RO: "EU", // Romania
  RU: "EU", // Russia (transcontinental, typically considered Europe for political/cultural reasons)
  SM: "EU", // San Marino
  RS: "EU", // Serbia
  SK: "EU", // Slovakia
  SI: "EU", // Slovenia
  ES: "EU", // Spain
  SE: "EU", // Sweden
  CH: "EU", // Switzerland
  UA: "EU", // Ukraine
  GB: "EU", // United Kingdom
  VA: "EU", // Vatican City

  // North America (NA)
  AG: "NA", // Antigua and Barbuda
  BS: "NA", // Bahamas
  BB: "NA", // Barbados
  BZ: "NA", // Belize
  CA: "NA", // Canada
  CR: "NA", // Costa Rica
  CU: "NA", // Cuba
  DM: "NA", // Dominica
  DO: "NA", // Dominican Republic
  SV: "NA", // El Salvador
  GD: "NA", // Grenada
  GT: "NA", // Guatemala
  HT: "NA", // Haiti
  HN: "NA", // Honduras
  JM: "NA", // Jamaica
  MX: "NA", // Mexico
  NI: "NA", // Nicaragua
  PA: "NA", // Panama
  KN: "NA", // Saint Kitts and Nevis
  LC: "NA", // Saint Lucia
  VC: "NA", // Saint Vincent and the Grenadines
  TT: "NA", // Trinidad and Tobago
  US: "NA", // United States

  // Oceania (OC)
  AU: "OC", // Australia
  FJ: "OC", // Fiji
  KI: "OC", // Kiribati
  MH: "OC", // Marshall Islands
  FM: "OC", // Micronesia
  NR: "OC", // Nauru
  NZ: "OC", // New Zealand
  PW: "OC", // Palau
  PG: "OC", // Papua New Guinea
  WS: "OC", // Samoa
  SB: "OC", // Solomon Islands
  TO: "OC", // Tonga
  TV: "OC", // Tuvalu
  VU: "OC", // Vanuatu

  // South America (SA)
  AR: "SA", // Argentina
  BO: "SA", // Bolivia
  BR: "SA", // Brazil
  CL: "SA", // Chile
  CO: "SA", // Colombia
  EC: "SA", // Ecuador
  GY: "SA", // Guyana
  PY: "SA", // Paraguay
  PE: "SA", // Peru
  SR: "SA", // Suriname
  UY: "SA", // Uruguay
  VE: "SA", // Venezuela
} as const;
export type CountryCode = keyof typeof countryCodeToContinentMap;

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
export function getContinent(country: string): Continent | undefined {
  if (countryCodeToContinentMap[country as CountryCode]) {
    return countryCodeToContinentMap[country as CountryCode];
  }

  const countryCode = countryNameToCodeMap[country];
  if (countryCode) {
    return countryCodeToContinentMap[countryCode];
  }

  return undefined;
}
