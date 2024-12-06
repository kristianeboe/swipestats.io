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
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ProfileLocationFormProps {
  profileLocation?: {
    city: string;
    region: string;
    country: string;
  };
  onSave: (location: any) => void;
}

const locationFormSchema = z.object({
  city: z.string().min(1, "City is required"),
  region: z.string(),
  country: z.string().min(1, "Country is required"),
  continent: z.string().min(1, "Continent is required"),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

export function ProfileLocationForm({
  profileLocation,
  onSave,
}: ProfileLocationFormProps) {
  const isState = !!US_STATES[profileLocation?.region ?? ""];
  const countryFromRegion = regionToCountryMap[profileLocation?.region ?? ""];

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      city: profileLocation?.city ?? "",
      region: profileLocation?.region ?? "",
      country: profileLocation?.country ?? "",
      continent: getContinent(profileLocation?.country ?? "") ?? "",
    },
  });

  const country = form.watch("country");
  const isUS = country === "US";

  const handleCityChange = (newCity: string) => {
    form.setValue("city", newCity);
    const detectedCountry = getCountryForCity(newCity);
    if (detectedCountry !== "Unknown") {
      form.setValue("country", detectedCountry);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="col-span-3"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">
                  {isUS ? "State" : "Region"}
                </FormLabel>
                <FormControl>
                  {isUS ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="col-span-3">
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
                  ) : (
                    <Input {...field} className="col-span-3" />
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Country</FormLabel>
                <FormControl>
                  <Input {...field} className="col-span-3" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="continent"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Continent</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
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
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
