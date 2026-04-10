/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { broadcast } from "@/lib/sse";

// GET — list notifications (optionally filter: ?filter=unread|read)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "unread" | "read" | null

    const query: any = {};
    if (filter === "unread") query.read = false;
    if (filter === "read") query.read = true;

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .limit(100)
      .lean();

    const mapped = notifications.map((n: any) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      description: n.description,
      read: n.read,
      link: n.link || null,
      time: n.created_at,
    }));

    return NextResponse.json({ data: mapped });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create notification (internal use from other API routes)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const notif = await Notification.create({
      type: body.type || "system",
      title: body.title,
      description: body.description,
      link: body.link,
      read: false,
      created_at: new Date(),
    });

    const payload = {
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      description: notif.description,
      read: false,
      link: notif.link || null,
      time: notif.created_at,
    };

    // Push to all connected SSE clients
    broadcast("notifications", { event: "new_notification", data: payload });

    return NextResponse.json({ data: payload });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — mark all as read
export async function PATCH() {
  try {
    await connectToDatabase();
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    broadcast("notifications", { event: "all_read" });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
