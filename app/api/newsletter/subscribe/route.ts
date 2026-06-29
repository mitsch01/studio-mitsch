import clientPromise from '@/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    const subscribers = db.collection('subscribers')

    const existing = await subscribers.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    await subscribers.insertOne({
      email,
      name: name || '',
      subscribedAt: new Date(),
      isActive: true,
    })

    // Send welcome email
    await resend.emails.send({
      from: 'Miriam @ Studio Mitsch <hello@studio-mitsch.de>',
      to: email,
      subject: 'Welcome to Studio Mitsch',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
          <h1 style="font-size: 2rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em;">
            Welcome${name ? `, ${name}` : ''}!
          </h1>
          <p style="color: #555; line-height: 1.6;">
            Thanks for subscribing to Studio Mitsch! I'll send occasional updates on projects and new work.
          </p>
          <p style="color: #555; line-height: 1.6;">
            In the meantime, feel free to explore the site or reach out if you have a project in mind.
          </p>
          <a href="https://studio-mitsch.de" 
             style="display: inline-block; margin-top: 1.5rem; background: #e8175d; color: white; 
                    padding: 0.75rem 1.5rem; text-decoration: none; font-size: 0.75rem; 
                    text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
            Visit Studio Mitsch
          </a>
          <p style="margin-top: 2rem; font-size: 0.75rem; color: #999;">
            Don't want to hear from me? 
            <a href="https://studio-mitsch.de/api/newsletter/unsubscribe?email=${email}" 
               style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}