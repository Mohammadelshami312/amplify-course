import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3Client";
//import { IncomingForm } from "formidable-serverless";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const s3Url = await uploadToS3(buffer, file.name, file.type);

  return NextResponse.json({ url: s3Url });
}
