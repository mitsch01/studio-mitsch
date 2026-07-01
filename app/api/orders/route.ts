import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/mongodb'
import { Resend } from 'resend'
import { createClient } from 'next-sanity'
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

const sanity = createClient({
  projectId: 'v6oxqy1t',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

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

    // Send order confirmation email if we have a customer email
    if (customerEmail) {
      // Fetch product names from Sanity
      const products = await sanity.fetch(
        `*[_type == "product" && slug.current in $slugs] { name }`,
        { slugs }
      )
      const itemNames = products.map((p: { name: string }) => p.name)

      // Get customer name from MongoDB if they have an account
      const user = await db.collection('clients').findOne({ email: customerEmail })

      await resend.emails.send({
        from: 'Miriam @ Studio Mitsch <hello@studio-mitsch.de>',
        to: customerEmail,
        subject: 'Your Studio Mitsch order is confirmed',
        react: OrderConfirmationEmail({
          name: user?.name,
          items: itemNames,
          dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account/dashboard`,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order save error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}