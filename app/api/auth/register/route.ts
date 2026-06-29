import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    const clients = db.collection('clients')

    const existing = await clients.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await clients.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    const token = jwt.sign(
      { id: result.insertedId.toString(), email, name },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}