import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '@/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const client = await clientPromise
      const db = client.db('studio-mitsch-prod')
      await db.collection('orders').insertOne({
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email,
        amount: session.amount_total,
        currency: session.currency,
        slugs: session.metadata?.slugs?.split(',') ?? [],
        createdAt: new Date(),
      })
    } catch (error) {
      console.error('Failed to save order:', error)
    }
  }

  return NextResponse.json({ received: true })
}

// Required — disable body parsing so Stripe signature verification works
export const config = {
  api: { bodyParser: false },
}