import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.NEWSLETTER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db('studio-mitsch-prod')
  const count = await db.collection('subscribers').countDocuments({ isActive: true })

  return NextResponse.json({ count })
}