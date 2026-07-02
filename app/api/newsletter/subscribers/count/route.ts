import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.NEWSLETTER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db('studio-mitsch-prod')
  
  const [count, recent] = await Promise.all([
  db.collection('subscribers').countDocuments({ isActive: { $ne: false } }),
  db.collection('subscribers')
    .find({ isActive: { $ne: false } })
    .sort({ subscribedAt: -1 })
    .limit(5)
    .toArray()
])

  return NextResponse.json({ count, recent })
}