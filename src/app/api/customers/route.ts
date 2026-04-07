/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Company from "@/models/Company";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const companies = await Company.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ data: companies });
  } catch (error: any) {
    console.error("GET /api/customers error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // Insert company
    const newCompany = await Company.create({
      company_name: body.company_name,
      primary_contact_name: body.primary_contact_name || "",
      primary_contact_email: body.primary_contact_email || "",
      primary_contact_phone: body.primary_contact_phone || "",
      is_active: body.is_active ?? true,
      insurance_status: body.insurance_status || "pending",
    });

    // Insert associated default user
    await User.create({
      company_id: newCompany._id,
      email: body.primary_contact_email || `admin@company-${newCompany._id.toString().slice(-4)}.test`,
      full_name: body.primary_contact_name || "Admin User",
      role: "admin",
    });

    return NextResponse.json({ success: true, data: { id: newCompany._id } });
  } catch (error: any) {
    console.error("POST /api/customers error:", error.message);
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 500 });
  }
}
