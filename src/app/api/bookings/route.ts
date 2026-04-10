import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import RangeBay from "@/models/RangeBay";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = (session.user as any).id;

    if (userId === "superadmin_adeel") {
      const bookings = await Booking.find().sort({ booking_date: 1, start_time: 1 });
      return NextResponse.json({ data: bookings });
    }

    const user = await User.findById(userId).populate("company_id");
    if (!user || !user.company_id) {
       return NextResponse.json({ data: [] });
    }

    const bookings = await Booking.find({ company_id: user.company_id._id }).sort({ booking_date: 1, start_time: 1 });
    return NextResponse.json({ data: bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const userId = (session.user as any).id;
    let companyIdStr: string | null = null;
    let companyName: string = "Superadmin Booking";
    let userName: string = session.user.name || "Superadmin";

    if (userId !== "superadmin_adeel") {
      const user = await User.findById(userId).populate("company_id");
      if (!user || !user.company_id) {
        return NextResponse.json({ error: "User has no associated company to book for" }, { status: 400 });
      }
      const populatedCompany = user.company_id as any;
      companyIdStr = populatedCompany._id.toString();
      companyName = populatedCompany.company_name;
      userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    } else {
      companyIdStr = body.company_id || null; // allow superadmin to supply company id if needed, else omit
    }

    const bay = await RangeBay.findById(body.bay_id);
    if (!bay) {
      return NextResponse.json({ error: "Selected Bay not found" }, { status: 404 });
    }

    const reference_id = `BKG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Basic calculation
    const isSameDay = new Date().toISOString().split("T")[0] === body.booking_date;
    const price = isSameDay ? bay.same_day_price : bay.base_price;
    const total_quoted_price = price < bay.minimum_booking_fee ? bay.minimum_booking_fee : price;

    const newBooking = await Booking.create({
      reference_id,
      company_id: companyIdStr || bay._id, // Fallback if superadmin booking with no company
      company_name_snapshot: companyName,
      requesting_user_id: userId !== "superadmin_adeel" ? userId : undefined,
      requesting_user_name_snapshot: userName,
      bay_id: bay._id,
      bay_name_snapshot: bay.bay_name,
      booking_date: body.booking_date,
      start_time: body.start_time || "00:00",
      end_time: body.end_time || "23:59",
      time_zone: "America/Los_Angeles",
      price_per_person_snapshot: bay.per_person_rate || 0,
      minimum_booking_fee_snapshot: bay.minimum_booking_fee || 0,
      base_price_snapshot: price,
      same_day_discount_applied: false, // You can refine logic here later
      total_quoted_price,
      customer_notes: body.customer_notes || "",
      status: "Pending",
      audit_log: [
        {
          action: "Created Booking",
          user_id: userId !== "superadmin_adeel" ? userId : undefined,
          details: `Requested by ${userName}`
        }
      ]
    });

    return NextResponse.json({ data: newBooking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
