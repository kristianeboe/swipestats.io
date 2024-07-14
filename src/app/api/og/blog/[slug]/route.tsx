// Image for blog post
import { SwipestatsLogo } from "@/svg/logos/SwipestatsLogo";
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const slug = req.url.split("/").pop();
  if (!slug) {
    throw new Error("No slug found");
  }

  const text = decodeURIComponent(slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1 className="text-center text-6xl font-black">{text}</h1>

        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "20px",
            right: "20px",
          }}
        >
          <SwipestatsLogo />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
