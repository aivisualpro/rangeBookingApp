/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Company from "@/models/Company";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    
    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data: company });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    await connectToDatabase();
    
    // Prevent updating id or timestamps manually
    delete body.id;
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;

    if (body.allowed_bays && Array.isArray(body.allowed_bays)) {
      body.allowed_bays = body.allowed_bays.map((bayId: string) => new mongoose.Types.ObjectId(bayId));
    }

    const company = await Company.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body.status === "inactive" || body.status === "suspended") {
      await User.updateMany(
        { company_id: id },
        { $set: { status: body.status } }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    console.error("PUT error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    
    await Company.findByIdAndDelete(id);
    await User.deleteMany({ company_id: id });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
