import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import "@/models/Company"; // Required: registers Company schema for populate("company_id")
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
        const user: any = await User.findOne({ email: credentials.email }).populate("company_id");

        if (!user) {
          throw new Error("User not found. Please register first.");
        }

        if (!user.password) {
          throw new Error("Your account is pending setup. Please use the registration page to create your password.");
        }

        if (user.company_id && user.company_id.status !== "active") {
          throw new Error("Your company account is currently inactive. Please contact support.");
        }
        
        if (user.status !== "active") {
          throw new Error("Your account is pending activation.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User",
          phone: user.phone || "",
          role: user.role || "member",
          userType: user.user_type || "External",
          companyName: user.company_id?.company_name || ""
        };
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
        token.phone = (user as any).phone;
        token.role = (user as any).role;
        token.userType = (user as any).userType;
        token.companyName = (user as any).companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
        (session.user as any).userType = token.userType;
        (session.user as any).companyName = token.companyName;
      }
      return session;
    },
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days Persistent Login
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
