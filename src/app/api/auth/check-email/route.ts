import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ exists: false });
    
    await connectToDatabase();
    // Use insensitive case matching just in case
    const existingUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    
    if (existingUser) {
      return NextResponse.json({ exists: true, status: existingUser.status || "inactive" });
    }
    
    return NextResponse.json({ exists: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
