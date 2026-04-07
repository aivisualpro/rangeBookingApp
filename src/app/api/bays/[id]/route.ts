/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RangeBay from "@/models/RangeBay";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await connectToDatabase();
    const bay = await RangeBay.findById(id);
    if (!bay) return NextResponse.json({ error: "Bay not found" }, { status: 404 });
    return NextResponse.json({ data: bay });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await req.json();
    await connectToDatabase();
    const bay = await RangeBay.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!bay) return NextResponse.json({ error: "Bay not found" }, { status: 404 });
    return NextResponse.json({ data: bay });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await connectToDatabase();
    await RangeBay.findByIdAndDelete(id);
    return NextResponse.json({ message: "Bay deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
