"use client";

import { Text } from "@/app/_components/ui/text";
import Typewriter from "typewriter-effect";

export function HeroHeading() {
  return (
    <Text.MarketingH1>
      Visualize your
      <Typewriter
        // onInit={(typewriter) => {
        //   typewriter

        //     .typeString("Tinder")
        //     .callFunction(() => {
        //       console.log("String typed out!");
        //     })
        //     .pauseFor(2500)
        //     .deleteAll()
        //     .callFunction(() => {
        //       console.log("All strings were deleted");
        //     })
        //     .typeString("Hinge")
        //     .pauseFor(2500)
        //     .deleteAll()
        //     .typeString("Bumble")
        //     .pauseFor(2500)
        //     .deleteAll()
        //     .start();
        // }}

        options={{
          strings: ["Tinder", "Hinge", "Bumble"],
          autoStart: true,
          loop: true,
        }}
      />
      {/* <TypewriterEffectSmooth
        words={[
          {
            text: "Tinder",
          },
          {
            text: "Hinge",
          },
          {
            text: "Bumble",
          },
        ]}
      />{" "} */}
      data
    </Text.MarketingH1>
  );
}
