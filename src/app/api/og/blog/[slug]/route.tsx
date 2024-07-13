// Image for blog post
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const slug = req.url.split("/").pop();

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
        }}
      >
        🔥 {slug}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
