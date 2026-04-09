import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).populate("company_id").sort({ createdAt: -1 });
    
    const mappedUsers = users.map(u => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown User";
      const company = u.company_id as any;
      return {
        id: u._id.toString(),
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        name: fullName,
        email: u.email,
        phone: u.phone || "",
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

    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    if (existingUser) {
      if (existingUser.password) {
        return NextResponse.json({ error: "User with this email already exists and is fully registered." }, { status: 400 });
      } else {
        // This is a placeholder account lacking a password. Let's finish their setup!
        existingUser.password = hashedPassword;
        existingUser.first_name = data.first_name;
        existingUser.last_name = data.last_name;
        existingUser.phone = data.phone;
        existingUser.user_type = data.user_type || existingUser.user_type;
        existingUser.status = "inactive"; // Pending admin approval like any other new registration
        if (data.company_id && data.company_id !== "none") {
          existingUser.company_id = data.company_id;
        }
        await existingUser.save();
        return NextResponse.json({ data: existingUser });
      }
    }

    const newUser = await User.create({
      user_type: data.user_type || "External",
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
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
