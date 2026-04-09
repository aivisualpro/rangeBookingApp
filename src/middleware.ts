import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - api/register (Custom registration API)
     * - login (Login page)
     * - register (Registration page/wizard)
     * - forgot-password
     * - reset-password
     * - _next/static (Static files)
     * - _next/image (Image optimization files)
     * - favicon.ico (Favicon)
     * - public assets (images, fonts, etc ending in common extensions)
     * - $ (Root path / marketing landing page)
     */
    "/((?!api/auth|login|register|forgot-password|reset-password|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$|$).*)",
  ],
};
