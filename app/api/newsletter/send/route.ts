import NewsletterEmail from "@/emails/NewsletterEmail";
import clientPromise from "@/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // 1. Verify secret token
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.NEWSLETTER_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get subject + body from request
    const { subject, html } = await req.json();
    if (!subject || !html) {
      return NextResponse.json(
        { error: "Missing subject or html" },
        { status: 400 },
      );
    }

    // 3. Fetch all active subscribers
    const client = await clientPromise;
    const db = client.db("studio-mitsch-prod");
    const subscribers = await db
      .collection("subscribers")
      .find({ isActive: true })
      .toArray();

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers" },
        { status: 404 },
      );
    }

    // 4. Send via Resend batch API
    const emails = subscribers.map((sub) => ({
      from: "Miriam @ Studio Mitsch <hello@studio-mitsch.de>",
      to: sub.email,
      subject,
      react: NewsletterEmail({
        subject,
        bodyHtml: html,
        unsubscribeEmail: sub.email,
      }),
    }));

    // Resend batch limit is 100 emails per call
    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await resend.batch.send(batch);
    }

    return NextResponse.json({
      success: true,
      sent: subscribers.length,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
