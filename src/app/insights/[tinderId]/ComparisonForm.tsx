"use client";

import { Button } from "@/app/_components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  comparisonId: z.string(),
});

export function ComparisonForm(props: { tinderId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  //   const comparisonProfilesQuery = api.profile.compare.useQuery({
  //     tinderId: props.tinderId,
  //     comparisonIds: [],
  //   });

  function addComparisonId(data: { comparisonId: string }) {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    const comparisonIdsQueryParam = current.get("comparisonIds");
    const existingComparisonIds = comparisonIdsQueryParam?.split(",");

    if (data.comparisonId === props.tinderId) {
      toast("You are trying to compare with yourself");
      return;
    }

    if (existingComparisonIds?.includes(data.comparisonId)) {
      toast("You are already comparing with this id");
      return;
    }

    // update as necessary
    const newComparisonIds = existingComparisonIds
      ? `${existingComparisonIds.join(",")},${data.comparisonId}`
      : data.comparisonId;

    const query = `?comparisonIds=${newComparisonIds}`;
    console.log({
      existingComparisonIds,
      newComparisonIds,
      query,
    });

    // current.set("comparisonIds", newComparisonIds);

    router.push(`${pathname}${query}`);
    form.reset();
  }

  return (
    <div>
      <form
        className="mx-auto my-6 flex w-full max-w-lg flex-col justify-center sm:flex-row"
        onSubmit={form.handleSubmit(addComparisonId)}
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
