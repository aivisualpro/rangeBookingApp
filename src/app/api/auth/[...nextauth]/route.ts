import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
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

        if (credentials.email === "adeel@symxlogistics.com" && credentials.password === "gigMox-tiqpah-1jyxgy") {
          return { id: "superadmin_adeel", email: credentials.email, name: "Adeel (Super Admin)" };
        }

        await connectToDatabase();
        const user: any = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("User not found. Register First!");
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
    async signIn({ user }) {
      if (user.id && user.id !== "superadmin_adeel") {
        await connectToDatabase();
        try {
          await User.updateOne(
            { _id: user.id },
            { $set: { last_active: new Date() } }
          );
        } catch (e) {
          console.error("Failed to update last_active", e);
        }
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
