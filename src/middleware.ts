import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export default function middleware(request: NextRequest) {
  // Extract country. Default to US if not found.
  const country = request.geo?.country;

  console.log(`Visitor from ${country}`);

  // Rewrite to URL
  return NextResponse.rewrite(request.url);
}
