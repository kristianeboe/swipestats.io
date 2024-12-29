"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { getCountryForCity } from "@/lib/utils/cityMapping";
import { getContinent } from "@/lib/utils/countryToContinent";
import { regionToCountryMap } from "@/lib/utils/regionMapping";
import { US_STATES } from "@/lib/utils/usStates";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCountryFromBrowserTimeZone } from "@/lib/utils/getCountryFromTimeZone";

const locationFormSchema = z.object({
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
  state: z.string().optional(),
  country: z
    .string()
    .min(2, "Country code is required")
    .max(2, "Must be a 2-letter country code"),
  continent: z.enum(["NA", "SA", "EU", "AS", "AF", "OC", "AN"], {
    required_error: "Please select a continent",
  }),
});

interface ProfileLocationFormProps {
  profileLocation?: {
    city: string;
    region: string;
    country?: string;
    continent?: string;
  };
  onSave: (location: z.infer<typeof locationFormSchema>) => void;
  onCancel?: () => void;
}

type LocationFormValues = z.infer<typeof locationFormSchema>;

export function ProfileLocationForm({
  profileLocation,
  onSave,
  onCancel,
}: ProfileLocationFormProps) {
  const countryFromRegion = regionToCountryMap[profileLocation?.region ?? ""];

  const userCountryFromBrowser = getCountryFromBrowserTimeZone();

  const initialCountry =
    profileLocation?.country ?? countryFromRegion ?? userCountryFromBrowser;
  const initialContinent = initialCountry
    ? getContinent(initialCountry)
    : undefined;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      city: profileLocation?.city ?? "",
      region: profileLocation?.region ?? "",
      country: initialCountry,
      continent: initialContinent,
    },
  });
  const formValues = form.watch();

  const handleCityChange = (newCity: string) => {
    const detectedCountry = getCountryForCity(newCity);
    if (detectedCountry) {
      form.setValue("country", detectedCountry);

      const continent = getContinent(detectedCountry);
      if (continent) {
        form.setValue("continent", continent);
      }

      if (formValues.region) {
        const regionCountry = regionToCountryMap[formValues.region];
        console.log("region", {
          detectedCountry,
          region: formValues.region,
          regionCountry,
          formState: formValues.state,
        });
        if (regionCountry !== detectedCountry) {
          form.setValue("region", "");
        }
        if (detectedCountry === "US") {
          form.setValue("state", formValues.region);
        }
      }
    }
  };

  const handleRegionBlur = (region: string) => {
    const country = regionToCountryMap[region];
    if (country) {
      if (country === "US" && US_STATES[region]) {
        form.setValue("state", region);
      }
      form.setValue("country", country);
      const continent = getContinent(country);
      if (continent) {
        form.setValue("continent", continent);
      }
    }
  };

  const handleStateChange = (state: string) => {
    if (!formValues.region) {
      form.setValue("region", state);
    }
  };

  const handleCountryBlur = (country: string) => {
    const continent = getContinent(country);
    if (continent) {
      form.setValue("continent", continent);
    }
  };

  const region = formValues.region;
  const country = formValues.country;
  const isUS = country === "US";

  const disableCountry =
    !!regionToCountryMap[formValues.region] && formValues.region !== "";
  const disableContinent = !!getContinent(formValues.country);

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    onSave(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCityChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      handleRegionBlur(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isUS && (
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleStateChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={!!formValues.region}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(US_STATES).map(([abbr, name]) => (
                          <SelectItem key={abbr} value={abbr}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={2}
                    className="uppercase"
                    disabled={disableCountry}
                    onBlur={(e) => {
                      field.onBlur();
                      handleCountryBlur(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="continent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent</FormLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disableContinent}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NA">North America</SelectItem>
                    <SelectItem value="SA">South America</SelectItem>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="AS">Asia</SelectItem>
                    <SelectItem value="AF">Africa</SelectItem>
                    <SelectItem value="OC">Oceania</SelectItem>
                    <SelectItem value="AN">Antarctica</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>Inferred by country</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
