import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const userId = (session.user as any).id;
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Auth check: superadmin or the company owning the booking
    if (userId !== "superadmin_adeel") {
       const user = await User.findById(userId).populate("company_id");
       const populatedCompany = user?.company_id as any;
       if (!user || !populatedCompany || populatedCompany._id.toString() !== booking.company_id.toString()) {
          return NextResponse.json({ error: "Permission denied" }, { status: 403 });
       }
    }

    // You can choose to softly cancel it or fully delete it
    // Let's hard delete for a calendar clean view
    await Booking.findByIdAndDelete(id);

    return NextResponse.json({ message: "Booking deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
