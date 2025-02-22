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
import { PHProvider } from "./_components/PostHogProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import dynamic from "next/dynamic";
import { PrismicPreview } from "@prismicio/next";
import { type Metadata } from "next";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
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
          <PHProvider>
            <NuqsAdapter>
              <Header />
              <main className="mt-12">{children}</main>
              <Footer />
              <PostHogPageView />
              <PrismicPreview repositoryName={"swipestats"} />
            </NuqsAdapter>
          </PHProvider>
        </TRPCReactProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
