import { Button, Section, Text } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";

const PawTestEmail = (params: {
  petOwnerEmail: string;
  petOwnerName?: string;
  appointmentDate: string;
  clinicAddress: string;
}) => {
  return (
    <BaseEmailLayout>
      <Section className="text-center">
        <Text className="text-2xl font-bold text-gray-800">
          Your Pet&apos;s Appointment Confirmation,{" "}
          {params.petOwnerName ? params.petOwnerName : "valued pet owner"}!
        </Text>
      </Section>

      <Section className="mt-6">
        <Text className="text-gray-700">
          We&apos;re excited to confirm your pet&apos;s upcoming appointment at
          our veterinary clinic. We look forward to providing the best care for
          your furry friend!
        </Text>
      </Section>

      <Section className="mt-8">
        <Text className="font-semibold text-gray-800">
          Appointment Details:
        </Text>
        <Text className="mt-2 text-gray-700">
          Date and Time: {params.appointmentDate}
        </Text>
        <Text className="mt-2 text-gray-700">
          Location: {params.clinicAddress}
        </Text>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          Need to reschedule or have questions? Click the button below to manage
          your appointment:
        </Text>
        <Button
          href="#"
          className="mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2"
        >
          Manage Your Appointment
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          Look, we&apos;ve laid out all the reasons why your pet care routine is
          a trainwreck and how our resources can help you stop being such a
          disaster. If you&apos;re still scrolling, you&apos;re either a
          masochist who enjoys pet care failure, or you&apos;re overthinking
          this like you overthink your pet&apos;s diet.
        </Text>
        <Button
          href="#"
          className="mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-950 focus-visible:ring-offset-2"
        >
          Explore Pet Care Resources
        </Button>
      </Section>

      <Section className="mt-8">
        <Text className="text-gray-700">
          If you have any questions or need to reach us before your appointment,
          please don&apos;t hesitate to reply to this email or contact our
          clinic directly.
        </Text>
      </Section>

      <Section className="mt-8 text-center">
        <Text className="text-sm text-gray-600">
          We look forward to seeing you and your pet soon!
        </Text>
      </Section>
    </BaseEmailLayout>
  );
};

PawTestEmail.PreviewProps = {
  petOwnerEmail: "petlover@example.com",
  petOwnerName: "Alex",
  appointmentDate: "May 15, 2024 at 2:00 PM",
  clinicAddress: "123 Paw Street, Petville, CA 90210",
};

export default PawTestEmail;
