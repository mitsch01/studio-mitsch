import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    const subscribers = db.collection('subscribers')

    // Check for duplicate
    const existing = await subscribers.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 409 }
      )
    }

    // Save subscriber
    await subscribers.insertOne({
      email,
      name: name || '',
      subscribedAt: new Date(),
      isActive: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}