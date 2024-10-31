"use client";

import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Form } from "@/app/_components/ui/form";
import { TextFormField } from "@/app/_components/ui/formFields/InputFormField";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CustomData } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInsightsProvider } from "./InsightsProvider";

export function AddMetricCard() {
  const { myCustomData } = useInsightsProvider();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card.Container>
        <Card.Header>
          <Card.Title>Custom data</Card.Title>
          <Card.Description>
            Add extra metrics to your insights
          </Card.Description>
        </Card.Header>
        <Card.Content></Card.Content>
        <Card.Footer>
          <Button onClick={() => setShowModal(true)}>Add Metrics</Button>
        </Card.Footer>
      </Card.Container>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add a metric</DialogTitle>
            <DialogDescription>
              Add a custom metric to your insights
            </DialogDescription>
          </DialogHeader>
          <CustomDataForm customData={myCustomData} />
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const customDataSchema = z.object({
  messaged: z.number().nullish(),
  goodConversation: z.number().nullish(),
  movedToADifferentApp: z.number().nullish(),
  phoneNumbersExchanged: z.number().nullish(),
  dateArranged: z.number().nullish(),
  dateAttended: z.number().nullish(),
  dateNoShow: z.number().nullish(),
  dateCreepy: z.number().nullish(),
  dateNoSpark: z.number().nullish(),
  onlyOneDate: z.number().nullish(),
  oneNightStands: z.number().nullish(),
  multipleDates: z.number().nullish(),
  sleptWithOnFirstDate: z.number().nullish(),
  sleptWithEventually: z.number().nullish(),
  friendsWithBenefits: z.number().nullish(),
  justFriends: z.number().nullish(),
  relationshipsStarted: z.number().nullish(),
  cohabitation: z.number().nullish(),
  married: z.number().nullish(),
  divorce: z.number().nullish(),
});

function CustomDataForm(props: { customData: CustomData }) {
  const form = useForm<z.infer<typeof customDataSchema>>({
    resolver: zodResolver(customDataSchema),
    defaultValues: {
      ...props.customData,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          console.log("submitted", data);
        })}
      >
        <TextFormField
          control={form.control}
          name="messaged"
          label="Messaged"
        />
        <TextFormField
          control={form.control}
          name="goodConversation"
          label="Good Conversation"
          description="A good conversation is defined as a conversation that leads to a date"
        />
        <TextFormField
          control={form.control}
          name="phoneNumbersExchanged"
          label="Phone Numbers Exchanged"
          description="Times you exchanged phone numbers with someone"
        />
        <TextFormField
          control={form.control}
          name="dateArranged"
          label="Date Arranged"
        />
        <TextFormField
          control={form.control}
          name="dateAttended"
          label="Date Attended"
        />
        <TextFormField
          control={form.control}
          name="dateNoShow"
          label="Date No Show"
        />
      </form>
    </Form>
  );
}
