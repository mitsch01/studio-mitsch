import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    const resetRecord = await db.collection('password_resets').findOne({ token })

    if (!resetRecord) {
      return NextResponse.json({ valid: false })
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      // Clean up the expired token while we're here
      await db.collection('password_resets').deleteOne({ token })
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Reset token validation error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}