import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

/**
 * Next.js 16 replaced the `middleware` convention with `proxy` (nodejs
 * runtime, not configurable). This guards the admin panel: anything under
 * /admin except the login page requires a valid session cookie.
 *
 * Pages still re-check the session where they render — this layer exists so
 * unauthenticated requests never reach admin rendering at all.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLogin = pathname === '/admin/login';
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token).catch(() => null);

  if (!session && !isLogin) {
    const url = new URL('/admin/login', request.url);
    if (pathname !== '/admin')
      url.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
