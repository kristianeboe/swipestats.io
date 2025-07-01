"use client";
import React, {
  useCallback,
  useState,
  forwardRef,
  useEffect,
  useMemo,
} from "react";

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

// utils
import { cn } from "@/lib/utils";

// assets
import { ChevronDown, CheckIcon, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import {
  allCountries,
  type CountryData,
  type Region,
} from "country-region-data";

// Interfaces matching country-region-data structure
// CountryData = [CountryName, CountrySlug, Region[]]
// Region = [RegionName, RegionSlug]

export interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: RegionData[];
}

export interface RegionData {
  name: string;
  shortCode: string;
}

// Helper functions to convert tuple data to object format
const convertCountryDataToObject = (
  countryData: CountryData,
): CountryRegion => {
  const [countryName, countryShortCode, regions] = countryData;
  return {
    countryName,
    countryShortCode,
    regions: regions.map(([name, shortCode]) => ({ name, shortCode })),
  };
};

const convertAllCountriesToObjects = (
  countries: CountryData[],
): CountryRegion[] => {
  return countries.map(convertCountryDataToObject);
};

// Helper functions
export const filterCountries = (
  countries: CountryRegion[],
  priorityCountries: string[],
  whitelist: string[],
  blacklist: string[],
): CountryRegion[] => {
  const countriesListedFirst: CountryRegion[] = [];
  let filteredCountries = countries;

  if (whitelist.length > 0) {
    filteredCountries = countries.filter(({ countryShortCode }) =>
      whitelist.includes(countryShortCode),
    );
  } else if (blacklist.length > 0) {
    filteredCountries = countries.filter(
      ({ countryShortCode }) => !blacklist.includes(countryShortCode),
    );
  }

  if (priorityCountries.length > 0) {
    // ensure the countries are added in the order in which they are specified by the user
    priorityCountries.forEach((slug) => {
      const result = filteredCountries.find(
        ({ countryShortCode }) => countryShortCode === slug,
      );
      if (result) {
        countriesListedFirst.push(result);
      }
    });

    filteredCountries = filteredCountries.filter(
      ({ countryShortCode }) => !priorityCountries.includes(countryShortCode),
    );
  }

  return countriesListedFirst.length
    ? [...countriesListedFirst, ...filteredCountries]
    : filteredCountries;
};

export const filterRegions = (
  regions: RegionData[],
  priorityRegions: string[],
  whitelist: string[],
  blacklist: string[],
): RegionData[] => {
  const regionsListedFirst: RegionData[] = [];
  let filteredRegions = regions;

  if (whitelist.length > 0) {
    filteredRegions = regions.filter(({ shortCode }) =>
      whitelist.includes(shortCode),
    );
  } else if (blacklist.length > 0) {
    filteredRegions = regions.filter(
      ({ shortCode }) => !blacklist.includes(shortCode),
    );
  }

  if (priorityRegions.length > 0) {
    // ensure the Regions are added in the order in which they are specified by the user
    priorityRegions.forEach((slug) => {
      const result = filteredRegions.find(
        ({ shortCode }) => shortCode === slug,
      );
      if (result) {
        regionsListedFirst.push(result);
      }
    });

    filteredRegions = filteredRegions.filter(
      ({ shortCode }) => !priorityRegions.includes(shortCode),
    );
  }

  return regionsListedFirst.length
    ? [...regionsListedFirst, ...filteredRegions]
    : filteredRegions;
};

// Country Select Component (using Select instead of Popover for consistency)
interface CountrySelectProps {
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
}

export function CountrySelect({
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  onChange,
  value,
  className,
  placeholder = "Country",
}: CountrySelectProps) {
  const countries = useMemo(() => {
    const convertedCountries = convertAllCountriesToObjects(allCountries);
    return filterCountries(
      convertedCountries,
      priorityOptions,
      whitelist,
      blacklist,
    );
  }, [priorityOptions, whitelist, blacklist]);

  return (
    <Select
      value={value}
      onValueChange={(value: string) => {
        onChange?.(value);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {countries.map(({ countryName, countryShortCode }) => (
          <SelectItem key={countryShortCode} value={countryShortCode}>
            {countryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Region Select Component
interface RegionSelectProps {
  countryCode: string;
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
}

export function RegionSelect({
  countryCode,
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  onChange,
  value,
  className,
  placeholder = "Region",
}: RegionSelectProps) {
  const regions = useMemo(() => {
    const countryData = allCountries.find(
      ([, shortCode]) => shortCode === countryCode,
    );

    if (countryData) {
      const convertedRegions = countryData[2].map(([name, shortCode]) => ({
        name,
        shortCode,
      }));
      return filterRegions(
        convertedRegions,
        priorityOptions,
        whitelist,
        blacklist,
      );
    }
    return [];
  }, [countryCode, priorityOptions, whitelist, blacklist]);

  if (!countryCode || regions.length === 0) {
    return null;
  }

  return (
    <Select
      value={value}
      onValueChange={(value: string) => {
        onChange?.(value);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {regions.map(({ name, shortCode }) => (
          <SelectItem key={shortCode} value={shortCode}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Enhanced Country Dropdown with flag support (keeping the original nice UI)
interface CountryDropdownProps {
  onChange?: (countryCode: string) => void;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
}

const CountryDropdownComponent = (
  {
    onChange,
    value,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    priorityOptions = [],
    whitelist = [],
    blacklist = [],
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);

  const countries = useMemo(() => {
    const convertedCountries = convertAllCountriesToObjects(allCountries);
    return filterCountries(
      convertedCountries,
      priorityOptions,
      whitelist,
      blacklist,
    );
  }, [priorityOptions, whitelist, blacklist]);

  const selectedCountry = useMemo(() => {
    if (value && countries.length > 0) {
      return countries.find((country) => country.countryShortCode === value);
    }
    return undefined;
  }, [value, countries]);

  const handleSelect = useCallback(
    (country: CountryRegion) => {
      onChange?.(country.countryShortCode);
      setOpen(false);
    },
    [onChange],
  );

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountry ? (
          <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
            <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <CircleFlag
                countryCode={selectedCountry.countryShortCode.toLowerCase()}
                height={20}
              />
            </div>
            {slim === false && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountry.countryName}
              </span>
            )}
          </div>
        ) : (
          <span>{slim === false ? placeholder : <Globe size={20} />}</span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="pointer-events-auto min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="pointer-events-auto max-h-[200px] w-full sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput
                placeholder="Search country..."
                className="pointer-events-auto"
              />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries?.length > 0 &&
                countries
                  .filter((x) => x?.countryName && x?.countryShortCode)
                  .map((option) => {
                    if (!option?.countryShortCode || !option?.countryName) {
                      return null;
                    }
                    return (
                      <CommandItem
                        className="flex w-full items-center gap-2"
                        key={option.countryShortCode}
                        onSelect={() => handleSelect(option)}
                      >
                        <div className="flex w-0 flex-grow space-x-2 overflow-hidden">
                          <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                            <CircleFlag
                              countryCode={option.countryShortCode.toLowerCase()}
                              height={20}
                            />
                          </div>
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {option.countryName}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0",
                            option.countryShortCode ===
                              selectedCountry?.countryShortCode
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
