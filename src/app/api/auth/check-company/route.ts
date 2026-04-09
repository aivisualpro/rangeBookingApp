import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Company from "@/models/Company";

export async function POST(req: Request) {
  try {
    const { company_name } = await req.json();
    if (!company_name) return NextResponse.json({ exists: false });
    
    await connectToDatabase();
    
    // Use insensitive case matching just in case
    const existingCompany = await Company.findOne({ company_name: new RegExp(`^${company_name}$`, 'i') });
    
    if (existingCompany) {
      return NextResponse.json({ exists: true });
    }
    
    return NextResponse.json({ exists: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
