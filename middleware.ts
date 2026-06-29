import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const { pathname } = req.nextUrl

  // Protect /account/* except login and register
  if (pathname.startsWith('/account') &&
    !pathname.startsWith('/account/login') &&
    !pathname.startsWith('/account/register')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/account/login', req.url))
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))
    } catch {
      return NextResponse.redirect(new URL('/account/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}