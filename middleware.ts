// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - auth/signin page (your new custom page)
     * - login page (if you still have it)
     * - static files
     * - favicon
     * - images
     */
    "/((?!auth/signin|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
