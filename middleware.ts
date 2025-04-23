import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/", // Allow public access to the homepage
  "/sign-in(.*)", // Sign-in page
  "/sign-up(.*)", // Sign-up page
  "/api/weebhook",
  "/dashbord",
]);

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect();
//   }
// });

const isAdminRoute = createRouteMatcher(["/expert(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Fetch the user's role from the session claims
  const userRole = (await auth()).sessionClaims?.metadata?.role;

  console.log("this my role ", userRole);
  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && !(userRole === "expert")) {
    const url = new URL("/ForFun", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
