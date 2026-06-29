import { NextResponse, type NextRequest } from 'next/server';
import { routes } from '@/config/routes';

/**
 * Name of the access-token cookie set by the API. It is sent on every path
 * (unlike the refresh cookie, which is scoped to the GraphQL endpoint), so it is
 * the right signal for a coarse route gate here. Fine-grained validation still
 * happens on the API; an expired access token is transparently renewed by the
 * client's silent-refresh link.
 */
const ACCESS_TOKEN_COOKIE = 'access_token';

const PROTECTED_PREFIXES = ['/projects'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);

  if (!hasSession && isProtected(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = routes.login;
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === routes.login) {
    const projectsUrl = request.nextUrl.clone();
    projectsUrl.pathname = routes.projects;
    projectsUrl.search = '';
    return NextResponse.redirect(projectsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/:path*', '/login'],
};
