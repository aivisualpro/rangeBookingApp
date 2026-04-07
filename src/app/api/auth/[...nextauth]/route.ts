import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectToDatabase();
        const user: any = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("User not found or you should sign in with Google.");
        }
        
        if (user.status !== "active") {
          throw new Error("Your account is pending activation.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        return { id: user._id.toString(), email: user.email, name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.user_name || "User" };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        let dbUser = await User.findOne({ email: user.email || "" });
        if (!dbUser) {
          dbUser = await User.create({
            email: user.email || "",
            first_name: user.name?.split(" ")[0] || "",
            last_name: user.name?.split(" ").slice(1).join(" ") || "",
            role: "admin", // They might make their own company
            status: "inactive",
          });
        }
        if (dbUser.status !== "active") {
          return "/login?error=AccountInactive";
        }
        user.id = dbUser._id.toString();
      }
      if (user.id) {
        await connectToDatabase();
        await User.updateOne(
          { _id: user.id },
          { $set: { last_active: new Date() } }
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
