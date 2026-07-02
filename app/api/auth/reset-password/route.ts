import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')

    // Find and validate token
    const resetRecord = await db.collection('password_resets').findOne({ token })

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      // Clean up expired token
      await db.collection('password_resets').deleteOne({ token })
      return NextResponse.json({ error: 'Reset link has expired' }, { status: 400 })
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12)
    await db.collection('clients').updateOne(
      { email: resetRecord.email },
      { $set: { password: hashedPassword } }
    )

    // Delete the used token
    await db.collection('password_resets').deleteOne({ token })

    // Get user for JWT
    const user = await db.collection('clients').findOne({ email: resetRecord.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Log them in automatically
    const authToken = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}