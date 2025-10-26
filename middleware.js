import { NextResponse } from 'next/server'

export function middleware(request) {
  // This is a simple middleware - in a real app, you'd check for authentication tokens
  // For now, we'll let the client-side handle authentication
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}