import WelcomeEmail from '@/emails/WelcomeEmail'
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
      if (existing.isActive) {
        // Genuinely already subscribed and active
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
      }

      // Previously unsubscribed — reactivate instead of rejecting
      await subscribers.updateOne(
        { email },
        { $set: { isActive: true, name: name || existing.name, resubscribedAt: new Date() } }
      )

      const { data, error } = await resend.emails.send({
        from: 'Miriam @ Studio Mitsch <hello@studio-mitsch.de>',
        to: email,
        subject: 'Welcome back to Studio Mitsch',
        react: WelcomeEmail({ name, email }),
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }

      return NextResponse.json({ success: true, resubscribed: true })
    }

    // Brand new subscriber
    await subscribers.insertOne({
      email,
      name: name || '',
      subscribedAt: new Date(),
      isActive: true,
    })

    const { data, error } = await resend.emails.send({
      from: 'Miriam @ Studio Mitsch <hello@studio-mitsch.de>',
      to: email,
      subject: 'Welcome to Studio Mitsch',
      react: WelcomeEmail({ name, email }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}