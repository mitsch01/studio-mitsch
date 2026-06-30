import { r2 } from "@/lib/r2";
import clientPromise from "@/mongodb";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Check auth
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    let user: { id: string; email: string; name: string };
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!),
      );
      user = payload as typeof user;
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Get requested slug
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // 3. Verify user has an order containing this slug
    const mongo = await clientPromise;
    const db = mongo.db("studio-mitsch-prod");
    const order = await db.collection("orders").findOne({
      customerEmail: user.email,
      slugs: slug,
    });

    if (!order) {
      return NextResponse.json({ error: "No purchase found" }, { status: 403 });
    }

    // 4. Get download key from MongoDB order or Sanity
    // Fetch product from Sanity to get the R2 key
    const { createClient } = await import("next-sanity");
    const sanity = createClient({
      projectId: "v6oxqy1t",
      dataset: "production",
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const product = await sanity.fetch(
      `*[_type == "product" && slug.current == $slug][0] { downloadKey, name }`,
      { slug },
    );

    if (!product?.downloadKey) {
      return NextResponse.json(
        { error: "File not available" },
        { status: 404 },
      );
    }

    // 5. Stream file from R2
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
      Key: product.downloadKey,
    });

    const r2Response = await r2.send(command);

    if (!r2Response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 6. Stream the response back to the user
    const stream = r2Response.Body.transformToWebStream();

    // Extract file extension from the R2 key (e.g. "downloads/Love.jpg" → "jpg")
    const extension = product.downloadKey.split(".").pop();
    const filename = `${product.name}.${extension}`;

    return new NextResponse(stream, {
      headers: {
        "Content-Type": r2Response.ContentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
