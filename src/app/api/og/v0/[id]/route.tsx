import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

import { getBlogPostAndAuthor } from "@/lib/utils/prismic.utils";
import { SwipestatsLogo } from "@/svg/logos/SwipestatsLogo";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { searchParams } = req.nextUrl;

  const { blog, author } = await getBlogPostAndAuthor(params.id);
  const title =
    blog.data.title ??
    searchParams.get("title") ??
    "Unlocking the Power of Data-Driven Decision Making";
  const description =
    blog.data.description ??
    searchParams.get("subtitle") ??
    "Explore the world of data analytics and how it can transform your business strategy.";
  // const author = searchParams.get("author") ?? "John Doe";
  console.log("author", author);
  const avatarUrl =
    author.profile_image.url! ?? "https://github.com/shadcn.png";
  const avatarResponse = await fetch(avatarUrl);
  const avatarData = await avatarResponse.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FEF2F2",
            padding: "16px 24px",
            borderRadius: "4px",
            marginTop: "64px",
          }}
        >
          <SwipestatsLogo
            style={{
              height: "32px",
              width: "32px",
            }}
          />
          <span
            style={{ fontSize: "32px", color: "#B91C1C", fontWeight: "bold" }}
          >
            swipestats.io
          </span>
        </div>

        {true ? (
          <h1
            style={{
              marginTop: "64px",
              fontSize: "64px",
              textAlign: "center",
              maxWidth: "80%",
            }}
            className="text-center text-6xl font-black"
          >
            {title}
          </h1>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#B91C1C",
                lineHeight: 1.2,
              }}
            >
              {title.split(" ").slice(0, -2).join(" ")}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1F2937",
                lineHeight: 1.2,
              }}
            >
              {title.split(" ").slice(-2).join(" ")}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginTop: "auto",
            background: "#FAFAFA",
            width: "100%",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              textAlign: "center",
              fontSize: "24px",
              color: "#4B5563",
              maxWidth: "70%",
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              color: "#4B5563",
            }}
          >
            <img
              // @ts-expect-error ArrayBuffer is accepted as a valid argument for src
              src={avatarData}
              alt=""
              className={"aspect-square h-full w-full rounded-full"}
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "100%",
                marginRight: "10px",
              }}
            />

            {author.name}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
