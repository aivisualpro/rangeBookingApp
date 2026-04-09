/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Company from "@/models/Company";
import User from "@/models/User";
import crypto from "crypto";

export async function GET() {
  try {
    await connectToDatabase();
    const companies = await Company.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ data: companies });
  } catch (error: any) {
    console.error("GET /api/companies error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const inviteToken = crypto.randomBytes(16).toString('hex');
    const signupUrl = `https://range-booking-app.vercel.app/register?type=external&token=${inviteToken}`;

    // Insert company
    const newCompany = await Company.create({
      company_name: body.company_name,
      primary_contact_name: body.primary_contact_name || "",
      primary_contact_email: body.primary_contact_email || "",
      primary_contact_phone: body.primary_contact_phone || "",
      is_active: body.is_active ?? true,
      insurance_status: body.insurance_status || "pending",
      invite_token: inviteToken,
      signup_url: signupUrl
    });

    const contactName = body.primary_contact_name || "Admin User";
    const nameParts = contactName.split(" ");

    // Insert associated default user
    await User.create({
      company_id: newCompany._id,
      email: body.primary_contact_email || `admin@company-${newCompany._id.toString().slice(-4)}.test`,
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "",
      role: "admin",
    });

    return NextResponse.json({ success: true, data: { id: newCompany._id } });
  } catch (error: any) {
    console.error("POST /api/companies error:", error.message);
    return NextResponse.json({ error: error.message || "Failed to create company" }, { status: 500 });
  }
}
