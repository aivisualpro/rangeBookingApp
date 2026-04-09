import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Company from "@/models/Company";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    if (!token) return NextResponse.json({ error: "No token provided" }, { status: 400 });
    
    await connectToDatabase();
    
    const company = await Company.findOne({ invite_token: token });
    
    if (!company) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }
    
    return NextResponse.json({ companyName: company.company_name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
