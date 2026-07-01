import clientPromise from "@/mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("MitschWebsite")
    const collection = db.collection("Haikus")

    const haikus = await collection.find({}).toArray()

    return NextResponse.json(haikus || [], { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/haikus:", error)
    return NextResponse.json({ message: "Error fetching haikus" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("MitschWebsite")
    const collection = db.collection("Haikus")

    const body = await req.json()
    const { haiku } = body

    if (!haiku) {
      return NextResponse.json({ message: "Haiku cannot be empty" }, { status: 400 })
    }

    await collection.insertOne({ haiku })

    return NextResponse.json({ message: "Haiku added", haiku }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /api/haikus:", error)
    return NextResponse.json({ message: "Error adding haiku" }, { status: 500 })
  }
}