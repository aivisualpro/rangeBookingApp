import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).populate("company_id").sort({ createdAt: -1 });
    
    const mappedUsers = users.map(u => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.user_name || "Unknown User";
      const company = u.company_id as any;
      return {
        id: u._id.toString(),
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        name: fullName,
        email: u.email,
        phone: u.phone || "",
        user_name: u.user_name || "",
        user_type: u.user_type || "External",
        company_id: company?._id?.toString() || "",
        company_name: company?.company_name || "",
        role: u.role || "member",
        status: u.status || "inactive",
        lastActive: u.last_active ? u.last_active.toISOString() : null,
        initials: fullName.substring(0, 2).toUpperCase(),
      };
    });
    
    return NextResponse.json({ data: mappedUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const newUser = await User.create({
      user_type: data.user_type || "External",
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      user_name: data.user_name,
      password: hashedPassword,
      company_id: data.company_id && data.company_id !== "none" ? data.company_id : undefined,
      status: data.status || "inactive",
      role: data.role || "member",
    });

    return NextResponse.json({ data: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
