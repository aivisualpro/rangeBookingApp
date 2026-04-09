import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await connectToDatabase();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const data = await req.json();
    await connectToDatabase();

    // Prevent updating protected fields
    delete data.id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.company_id === "none") {
      data.company_id = null;
    }

    if (data.password) {
      data.password = await require("bcryptjs").hash(data.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
