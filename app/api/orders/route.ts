import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { slugs, customerEmail } = await req.json()

    if (!slugs || slugs.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')

    await db.collection('orders').insertOne({
      slugs,
      customerEmail: customerEmail ?? null,
      amount: 0,
      currency: 'eur',
      stripeSessionId: null,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order save error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}