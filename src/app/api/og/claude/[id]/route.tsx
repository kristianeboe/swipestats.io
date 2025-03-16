import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const id = params.id;
  const { searchParams } = req.nextUrl;
  const blogSlug = searchParams.get("slug") ?? "Your Blog Name";
  const author = searchParams.get("author") ?? "Kristian Elset Bø";

  const title = "Claude";
  const subtitle = `A blog post by ${author}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#E11D48",
          backgroundImage: "linear-gradient(to right, #E11D48, #FDF2F8)",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>

          {/* Swipestats logo */}
          <div
            style={{
              backgroundColor: "white",
              width: "60px",
              height: "60px",
              marginBottom: "180px",
            }}
          />

          {/* Subtitle and author */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: "white",
                opacity: 0.8,
                maxWidth: "70%",
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                color: "white",
                opacity: 0.8,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "10px" }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {author}
            </div>
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
