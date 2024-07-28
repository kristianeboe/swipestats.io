import { Button, Section, Text, Hr, Img } from "@react-email/components";
import { BaseEmailLayout } from "./BaseEmailLayout";
const OnlineDatingSuccessEmail = () => {
  return (
    <BaseEmailLayout>
      <Section className="text-center">
        <Text className="text-2xl font-bold text-gray-800">
          Online Dating Success Formula
        </Text>
      </Section>
      <Section className="mt-6">
        <Text className="text-gray-700">
          Online dating is a &quot;winner takes all&quot; game. 10% of guys get
          90% of the results.
        </Text>
        <Text className="mt-2 text-gray-700">
          And there&apos;s a simple formula that goes well beyond &quot;just be
          a chad&quot; that you can follow to get into that 10% of guys:
        </Text>
        <Text className="mt-2 font-semibold text-gray-800">
          Getting dates = Look good + Good photos + Volume + Be normal
        </Text>
      </Section>
      <Section className="mt-8">
        <Text className="text-xl font-bold text-gray-800">1. Look good</Text>
        <Text className="mt-2 text-gray-700">
          But Paw, I am not traditionally good-looking how can I &quot;look
          good?&quot;
        </Text>
        <Text className="mt-2 text-gray-700">
          It doesn&apos;t mean you need to have the face of a male model. It
          just means you need to:
        </Text>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Get below 20% body fat</li>
          <li>Have a haircut / beard that suits your face shape</li>
          <li>Have a clothing style that&apos;s not sh*t</li>
          <li>Bonus points if you put on some muscle</li>
        </ul>
        <Text className="mt-2 text-gray-700">
          Congrats, you now outperform 80% of guys in the looks department.
        </Text>
      </Section>
      <Section className="mt-8">
        <Text className="text-xl font-bold text-gray-800">
          2. Get good photos
        </Text>
        <Text className="mt-2 text-gray-700">
          It goes without saying that your photos are still the most important
          thing in your dating profile.
        </Text>
        <Text className="mt-2 text-gray-700">
          So whip out that fancy phone of yours, find your best photographer
          friend and get shooting.
        </Text>
        <Text className="mt-2 text-gray-700">You can do:</Text>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Solo shoots</li>
          <li>Use a dedicated dating photographer</li>
        </ul>
      </Section>
      <Section className="mt-8">
        <Text className="text-xl font-bold text-gray-800">
          3. Put in volume
        </Text>
        <Text className="mt-2 text-gray-700">
          If you want results, you better start swinging that swiping thumb of
          yours.
        </Text>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Follow a swipe-strategy</li>
          <li>Swipe a lot and be active on the apps</li>
          <li>Actually message your matches</li>
        </ul>
      </Section>

      <Section className="mt-8">
        <Text className="text-xl font-bold text-gray-800">
          4. Don&apos;t be weird over text
        </Text>
        <Text className="mt-2 text-gray-700">
          Most guys shoot themselves in the foot by learning fancy &quot;text
          game&quot; that is actually off-putting to the girl.
        </Text>
        <Text className="mt-2 text-gray-700">
          You&apos;re much better off by being straight to the point, asking for
          her number after 3-5 messages and then setting up a date over text.
        </Text>
      </Section>
      <Hr className="my-8 border-gray-300" />
      <Section className="mt-8">
        <Text className="text-gray-700">Not sure how to get started?</Text>
        <Text className="mt-2 text-gray-700">
          Don&apos;t worry, over the next few weeks I will be sending you tonnes
          of in-depth emails that hold your hand the entire way.
        </Text>
        <Text className="mt-4 text-gray-700">
          Can&apos;t wait? Get the SwipeGuide, where we make it crazy easy for
          you to implement everything you need and start getting dates right
          away.
        </Text>
      </Section>
      <Section className="mt-8">
        <Button
          href="https://swipestats.io/swipeguide"
          className="bg-swipestats-primary hover:bg-swipestats-primary/90 focus-visible:ring-swipestats-primary mx-auto mt-4 inline-flex h-10 w-full max-w-md items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Get the SwipeGuide
        </Button>
      </Section>
      <Section className="mt-8 text-center">
        <Text className="text-sm text-gray-600">Your truly,</Text>
        <Text className="text-sm font-semibold text-gray-800">
          Paw - the older brother you never had
        </Text>
      </Section>
    </BaseEmailLayout>
  );
};
export default OnlineDatingSuccessEmail;
