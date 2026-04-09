/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";
import RangeBay from "@/models/RangeBay";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = (session.user as any).id;

    if (userId === "superadmin_adeel") {
      const allActiveBays = await RangeBay.find({ status: "Active" });
      return NextResponse.json({ data: allActiveBays });
    }

    const user = await User.findById(userId).populate("company_id");
    if (!user || !user.company_id) {
      return NextResponse.json({ data: [] });
    }

    const allowedBayIds = (user.company_id as any).allowed_bays || [];
    const activeAllowedBays = await RangeBay.find({
      _id: { $in: allowedBayIds },
      status: "Active"
    });

    return NextResponse.json({ data: activeAllowedBays });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
