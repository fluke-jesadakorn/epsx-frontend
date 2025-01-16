import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Bot protection middleware
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent)
  
  // Restrict bot access to only root path
  if (isBot && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Bot-Protection', 'active')
  
  // TODO: Add rate limiting for bots
  // TODO: Implement bot challenge system
  // TODO: Add bot logging for analytics
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
