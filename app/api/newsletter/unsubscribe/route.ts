import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribed?status=error', req.url)
      )
    }

    const client = await clientPromise
    const db = client.db('studio-mitsch-prod')
    await db.collection('subscribers').updateOne(
      { email },
      { $set: { isActive: false } }
    )

    return NextResponse.redirect(
      new URL('/newsletter/unsubscribed?status=success', req.url)
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribed?status=error', req.url)
    )
  }
}