// This is just a static image. Go to /[slug] to see the dynamic version.
import { ImageResponse } from "next/og";

import { SwipestatsLogo } from "@/svg/logos/SwipestatsLogo";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          color: "white",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          SwipeStats Blog
        </h1>
        <p
          style={{
            fontSize: 36,
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Data-driven insights for online dating
        </p>

        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: "40px",
            right: "80px",
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
