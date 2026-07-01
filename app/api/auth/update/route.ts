import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify current session
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let currentUser: { id: string; email: string; name: string }
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      )
      currentUser = payload as typeof currentUser
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // 2. Get update fields
    const { name, email, currentPassword, newPassword } = await req.json()

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    const clients = db.collection('clients')

    const existingUser = await clients.findOne({ _id: new ObjectId(currentUser.id) })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updates: Record<string, any> = {}

    // 3. Update name
    if (name && name !== existingUser.name) {
      updates.name = name
    }

    // 4. Update email — check for duplicates
    if (email && email !== existingUser.email) {
      const emailTaken = await clients.findOne({ email, _id: { $ne: existingUser._id } })
      if (emailTaken) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
      updates.email = email
    }

    // 5. Update password — requires current password verification
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required' }, { status: 400 })
      }
      const validPassword = await bcrypt.compare(currentPassword, existingUser.password)
      if (!validPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
      }
      updates.password = await bcrypt.hash(newPassword, 12)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 })
    }

    await clients.updateOne({ _id: existingUser._id }, { $set: updates })

    // 6. Issue a new JWT reflecting updated name/email
    const updatedUser = {
      id: currentUser.id,
      email: updates.email ?? existingUser.email,
      name: updates.name ?? existingUser.name,
    }

    const newToken = jwt.sign(updatedUser, process.env.JWT_SECRET!, { expiresIn: '30d' })

    const response = NextResponse.json({ success: true })
    response.cookies.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}