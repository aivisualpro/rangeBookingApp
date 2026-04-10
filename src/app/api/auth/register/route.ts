import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";
import Notification from "@/models/Notification";
import crypto from "crypto";
import { broadcast } from "@/lib/sse";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      password, 
      userType, 
      externalMode, 
      token, 
      companyData 
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let assignedCompanyId = undefined;
    let companyName = "";

    if (userType === "External") {
      if (externalMode === "existing_company") {
        if (!token) {
          return NextResponse.json({ error: "A registration token is required to join a company" }, { status: 400 });
        }
        const company = await Company.findOne({ invite_token: token });
        if (!company) {
          return NextResponse.json({ error: "Invalid registration token" }, { status: 400 });
        }
        assignedCompanyId = company._id;
        companyName = company.company_name;
      } else if (externalMode === "new_company") {
        if (!companyData || !companyData.company_name) {
          return NextResponse.json({ error: "Company name is required for registering a new company" }, { status: 400 });
        }
        
        const existingComp = await Company.findOne({ company_name: new RegExp(`^${companyData.company_name}$`, 'i') });
        if (existingComp) {
           return NextResponse.json({ error: "A company with this name already exists" }, { status: 400 });
        }
        
        const inviteToken = crypto.randomBytes(16).toString('hex');
        const signupUrl = `https://range-booking-app.vercel.app/register?type=external&token=${inviteToken}`;
        
        const newCompany = await Company.create({
          company_name: companyData.company_name,
          primary_contact_name: companyData.primary_contact_name || name,
          primary_contact_email: companyData.primary_contact_email || email,
          primary_contact_phone: companyData.primary_contact_phone || "",
          billing_contact_name: companyData.billing_contact_name || "",
          billing_contact_email: companyData.billing_contact_email || "",
          billing_contact_phone: companyData.billing_contact_phone || "",
          company_address: companyData.company_address || "",
          notes: companyData.notes || "",
          status: "inactive", // Default to inactive approval needed
          invite_token: inviteToken,
          signup_url: signupUrl
        });
        assignedCompanyId = newCompany._id;
        companyName = companyData.company_name;
      }
    }

    const user = await User.create({
      first_name: name.split(" ")[0] || "",
      last_name: name.split(" ").slice(1).join(" ") || "",
      email,
      password: hashedPassword,
      role: "member", // default to member. (External new company gets admin inside system later maybe, or just member until approved)
      user_type: userType || "External",
      company_id: assignedCompanyId,
      status: "inactive",
      phone: companyData?.primary_contact_phone || undefined,
    });

    // ── Real-time notifications ──────────────────────────────────────────
    const isNewCompany = userType === "External" && externalMode === "new_company";
    const notifTitle = isNewCompany
      ? `New company registered: ${companyName}`
      : `New user registered: ${name}`;
    const notifDescription = isNewCompany
      ? `${name} (${email}) registered a new company "${companyName}" and is pending approval.`
      : companyName
        ? `${name} (${email}) joined company "${companyName}" and is pending approval.`
        : `${name} (${email}) registered as ${userType} and is pending approval.`;

    const notif = await Notification.create({
      type: isNewCompany ? "company" : "registration",
      title: notifTitle,
      description: notifDescription,
      link: isNewCompany ? "/companies" : "/users",
      read: false,
      created_at: new Date(),
    });

    const notifPayload = {
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      description: notif.description,
      read: false,
      link: notif.link,
      time: notif.created_at,
    };

    // Broadcast notification to all connected admin dashboards
    broadcast("notifications", { event: "new_notification", data: notifPayload });

    // If a new company was created, also broadcast on the companies channel
    // so the /companies page auto-refreshes
    if (isNewCompany) {
      broadcast("companies", { event: "new_company", data: { company_name: companyName } });
    }
    // Also broadcast for existing company joins (user count changed)
    if (userType === "External" && externalMode === "existing_company") {
      broadcast("companies", { event: "company_updated", data: { company_name: companyName } });
    }

    return NextResponse.json({ success: true, userId: user._id });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}
