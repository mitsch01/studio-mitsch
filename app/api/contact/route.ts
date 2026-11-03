import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, service, message } = await request.json()
    const serviceLine = typeof service === "string" && service.trim() ? service.trim().slice(0, 100) : ""

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "studio-mitsch.de <hello@studio-mitsch.de>",
      // Direct to Gmail — the domain only forwards, and forwarded mail fails SPF at Gmail
      to: "studiomitsch@gmail.com",
      replyTo: email,
      subject: serviceLine ? `New message from ${name} — ${serviceLine}` : `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n${serviceLine ? `Service: ${serviceLine}\n` : ""}\nMessage:\n${message}`,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
