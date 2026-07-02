import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')

    // Check if user exists — but don't reveal whether they do or not
    const user = await db.collection('clients').findOne({ email })

    if (user) {
      // Generate a secure random token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now

      // Store token in MongoDB
      await db.collection('password_resets').insertOne({
        email,
        token,
        expiresAt,
        createdAt: new Date(),
      })

      // Send reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/account/reset-password?token=${token}`

      await resend.emails.send({
        from: 'Miriam @ Studio Mitsch <hello@studio-mitsch.de>',
        to: email,
        subject: 'Reset your Studio Mitsch password',
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111;">
            <h1 style="font-size: 2rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em;">
              Reset your password
            </h1>
            <p style="color: #555; line-height: 1.6;">
              We received a request to reset your Studio Mitsch password. 
              Click the button below to set a new one.
            </p>
            <a href="${resetUrl}" 
               style="display: inline-block; margin-top: 1.5rem; background: #e8175d; color: white; 
                      padding: 0.75rem 1.5rem; text-decoration: none; font-size: 0.75rem; 
                      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
              Reset Password
            </a>
            <p style="margin-top: 1.5rem; color: #999; font-size: 0.75rem;">
              This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      })
    }

    // Always return success — don't reveal whether email exists (security best practice)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}