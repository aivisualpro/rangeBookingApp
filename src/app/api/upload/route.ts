import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary credentials missing" }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureStr = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp.toString());
    cloudinaryFormData.append("signature", signature);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(uploadData.error?.message || "Cloudinary upload failed");
    }

    return NextResponse.json({ url: uploadData.secure_url });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
