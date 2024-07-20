import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Tailwind,
} from "@react-email/components";

interface BaseLayoutProps {
  children: React.ReactNode;
}

// needed?
export const TailwindConfig = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      .font-inter { font-family: 'Inter', sans-serif; }
      .bg-swipestats-primary { background-color: #5046e4; }
      .text-swipestats-primary { color: #5046e4; }
    `,
    }}
  />
);

export function BaseEmailLayout({ children }: BaseLayoutProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              // brand: "#007291",
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <TailwindConfig />
        </Head>
        <Tailwind>
          <Body className="font-inter bg-gray-100">
            <Container className="mx-auto max-w-xl p-4">
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <Header />
                <div className="p-6">{children}</div>
                <Footer />
              </div>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    </Tailwind>
  );
}

// Header.tsx
import { Img } from "@react-email/components";
import { SwipestatsLogo } from "@/svg/logos/SwipestatsLogo";

export function Header() {
  return (
    <Section className="border-b border-gray-200 bg-white p-6">
      {/* <Img
        src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg"
        width="150"
        height="50"
        alt="Swipestats.io"
        className="mx-auto"
      /> */}
      <SwipestatsLogo className="m-auto flex h-14 w-14" />
    </Section>
  );
}

// Footer.tsx

export function Footer() {
  return (
    <Section className="bg-gray-50 p-6 text-center text-sm text-gray-600">
      <Text className="mb-2">© 2024 Swipestats.io. All rights reserved.</Text>
      <Text>
        <Link
          target="_blank"
          href="https://swipestats.io/privacy"
          className="text-swipestats-primary hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link
          target="_blank"
          href="https://swipestats.io/tos"
          className="text-swipestats-primary hover:underline"
        >
          Terms of Service
        </Link>
      </Text>
    </Section>
  );
}

const footer = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderTop: "1px solid #e6ebf1",
};

const footerText = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const,
};
