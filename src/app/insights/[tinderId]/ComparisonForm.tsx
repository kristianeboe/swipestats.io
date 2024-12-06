"use client";

import { Button } from "@/app/_components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { useInsightsProvider } from "./InsightsProvider";

const FormSchema = z.object({
  comparisonId: z.string(),
});

export function ComparisonForm(props: { tinderId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { addComparisonId } = useInsightsProvider();

  //   const comparisonProfilesQuery = api.profile.compare.useQuery({
  //     tinderId: props.tinderId,
  //     comparisonIds: [],
  //   });

  function handleAddComparisonId(data: { comparisonId: string }) {
    addComparisonId(data);
    form.reset();
  }

  return (
    <div>
      <form
        className="mx-auto my-6 flex w-full max-w-lg flex-col justify-center sm:flex-row"
        onSubmit={form.handleSubmit(handleAddComparisonId)}
      >
        <label className="sr-only mb-1 text-gray-500" htmlFor="comparisonId">
          Compare with another Swipestats Id
        </label>

        <input
          id="comparisonId"
          className="focus:border-tinder w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
          type="text"
          placeholder="Compare with another Swipestats Id"
          {...form.register("comparisonId")}
        />

        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Button
            // className="focus:shadow-outline rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
            type="submit"
            className="w-full sm:w-auto"
          >
            Compare
          </Button>
        </div>
      </form>
      {/* <div className="mb-10 flex justify-center gap-4">
        <Button>Random</Button>
        <Button>Founder</Button>
        <Button>All Men</Button>
        <Button>All Women</Button>
        <Button>Global Average</Button>
      </div> */}
    </div>
  );
}
