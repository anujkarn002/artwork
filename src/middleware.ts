import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Create a response with the appropriate headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client using the request cookies
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // Update the response cookies
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Get the session - this will refresh the session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes for authenticated users
  const authRoutes = ["/dashboard", "/profile", "/account", "/orders"];

  // Protected routes specifically for artisans
  const artisanRoutes = ["/dashboard/products", "/dashboard/sales"];

  // Admin routes
  const adminRoutes = ["/admin"];

  // Redirect authenticated users away from auth pages
  if (
    session &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check protected routes
  if (
    !session &&
    (authRoutes.some((route) => pathname.startsWith(route)) ||
      artisanRoutes.some((route) => pathname.startsWith(route)) ||
      adminRoutes.some((route) => pathname.startsWith(route)))
  ) {
    // Save the original URL to redirect after login
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
