import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ success: true, userId: user._id });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}
