import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

const handler = NextAuth({
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Set cookie only for Google provider
      if (account?.provider === "google" && user?.email) {
        const cookieStore = await cookies();
        await cookieStore.set("sr.userData", JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle the callbackUrl from the signIn function
      if (url.startsWith("/retro/onboarding")) return url;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      // Persist user email to token
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.image) {
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Add email to session object
      if (token.email) {
        if (session.user) {
          session.user.email = token.email;
        }
      }
      if (token.name) {
        if (session.user) {
          session.user.name = token.name;
        }
      }
      if (token.image) {
        if (session.user) {
          session.user.image = token.image.toString();
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
