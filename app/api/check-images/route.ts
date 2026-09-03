import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { r2 } from "@/lib/r2";

const BUCKET = "studio-mitsch-assets";

async function listMatchingUrls(prefix: string) {
  const result = await r2.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }),
  );

  const keys = (result.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => Boolean(key));

  // Wichtig: S3/R2 sortiert Keys alphabetisch, nicht numerisch.
  // Ohne das hier käme "…-10.webp" vor "…-2.webp".
  keys.sort((a, b) => {
    const numA = parseInt(a.match(/-(\d+)\.webp$/)?.[1] ?? "0", 10);
    const numB = parseInt(b.match(/-(\d+)\.webp$/)?.[1] ?? "0", 10);
    return numA - numB;
  });

  return keys.map((key) => `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectName = searchParams.get("projectName");

  if (!projectName) {
    return NextResponse.json({ desktopImages: [], mobileImages: [] });
  }

  const [desktopImages, mobileImages] = await Promise.all([
    listMatchingUrls(`images/${projectName}-desktop-`),
    listMatchingUrls(`images/${projectName}-mobile-`),
  ]);

  return NextResponse.json({ desktopImages, mobileImages });
}