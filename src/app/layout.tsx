import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toaster } from "@/app/_components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
import { SpeedInsights } from "@vercel/speed-insights/next";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { PrismicPreview } from "@prismicio/next";
import { type Metadata } from "next";
import { PostHogProvider } from "./_components/PostHogProvider";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Swipestats | Visualize your Tinder data",
  description:
    "Upload your dating data anonymously and compare it to demographics from around the world!",
  openGraph: {
    type: "website",
    url: "https://swipestats.io/",
    title: "Swipestats | Visualize your Tinder data",
    description:
      "Upload your dating data anonymously and compare it to demographics from around the world!",
    images: [
      {
        url: "/ss2.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swipestats | Visualize your Tinder data",
    description:
      "Upload your dating data anonymously and compare it to demographics from around the world!",
    images: ["/ss2.png"],
  },
  icons: {
    icon: "/swipestatsFireLogo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-white`}>
        <TRPCReactProvider>
          <PostHogProvider>
            <NuqsAdapter>
              <Header />
              <main className="mt-12">{children}</main>
              <Footer />
              <PrismicPreview repositoryName={"swipestats"} />
            </NuqsAdapter>
          </PostHogProvider>
        </TRPCReactProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
