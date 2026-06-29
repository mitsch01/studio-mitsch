import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      name: string
    }

    return NextResponse.json({ user: decoded })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}