"use client";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default function UploadForm() {
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = e.currentTarget.file as HTMLInputElement;
    if (!fileInput.files?.length) return;
    formData.append("file", fileInput.files[0]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded file URL:", data.url);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}

export async function generateSignedUrl(fileName: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutes

  return url;
}
