import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session data from cookies
  const sessionCookie = request.cookies.get('fitness_session');
  const tokenCookie = request.cookies.get('fitness_token');

  const isAuthenticated = !!(sessionCookie && tokenCookie);

  // Redirect authenticated users away from login
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect dashboard routes
  const protectedPaths = ['/manager', '/trainer', '/client'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (isAuthenticated && isProtectedPath) {
    try {
      const session = JSON.parse(sessionCookie!.value);
      const accountType = session.accountType?.toLowerCase();

      // Check if user is accessing the correct dashboard
      if (pathname.startsWith('/manager') && accountType !== 'manager') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/trainer') && accountType !== 'personaltrainer') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/client') && accountType !== 'client') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // If session parsing fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

