/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RangeBay from "@/models/RangeBay";

export async function GET() {
  try {
    await connectToDatabase();
    const bays = await RangeBay.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: bays });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const newBay = await RangeBay.create(body);
    return NextResponse.json({ data: newBay });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
