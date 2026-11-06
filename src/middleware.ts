import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_URL } from './config/config';

function buildCsp(nonce: string, isDev: boolean): string {

  const apiOrigin = API_URL ? new URL(API_URL).origin : '';
  
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'
      https://www.google.com
      https://www.gstatic.com
      https://www.recaptcha.net
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://cdn.jsdelivr.net
      ${isDev ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline'
      https://fonts.googleapis.com
      https://cdn.jsdelivr.net;
      https://cdn.keka.com;
    img-src 'self' data: blob: https:;
    media-src 'self' https:;
    font-src 'self'
      https://fonts.gstatic.com
      https://cdn.jsdelivr.net
      https://cdn.keka.com
      data:;
    connect-src 'self'
      ${apiOrigin}
      https://project-demo.in
      https://*.keka.com
      https://www.google-analytics.com
      https://analytics.google.com
      https://stats.g.doubleclick.net
      https://www.gstatic.com
      https://www.recaptcha.net;
    frame-src 'self'
      https://www.youtube.com
      https://youtube.com
      https://www.youtube-nocookie.com
      https://youtube-nocookie.com
      https://www.google.com
      https://www.gstatic.com
      https://www.recaptcha.net
      https://samtel.keka.com
      https://maps.google.com
      https://www.google.com/maps/
      https://maps.googleapis.com
      https://www.googletagmanager.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();
}


function toInternalTarget(
  newUrl: string,
  request: NextRequest
): { pathname: string; search: string } | null {
  try {
    // For relative values, resolve against the current origin
    const base = request.nextUrl.origin + '/';
    const target = new URL(newUrl.trim(), base);

    // Treat www and non-www as the same site
    const strip = (h: string) => h.toLowerCase().replace(/^www\./, '');
    if (strip(target.hostname) !== strip(request.nextUrl.hostname)) {
      return null; // external redirect, reject
    }

    return { pathname: target.pathname, search: target.search };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === 'development';
  const nonce = btoa(crypto.randomUUID());
  const cspHeader = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  // Lowercase so "/Careers.html" matches the same redirect as "/careers.html"
  const slug = pathname.replace(/^\/+/, '').toLowerCase();
  if (!slug) {
    response.headers.set('x-pathname', pathname);
    return response;
  }

  try {
    if (!API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }

    const apiUrl = `${API_URL}redirect/${slug}`;
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json: unknown = await res.json();

      if (
        typeof json === 'object' &&
        json !== null &&
        'success' in json &&
        json.success === true &&
        'data' in json &&
        typeof json.data === 'object' &&
        json.data !== null &&
        'new_url' in json.data &&
        typeof json.data.new_url === 'string'
      ) {
        const target = toInternalTarget(json.data.new_url, request);

        if (target && target.pathname !== pathname) {
          // Clone keeps the host the user actually requested (www / non-www)
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = target.pathname;
          redirectUrl.search = target.search;

          const redirectResponse = NextResponse.redirect(redirectUrl, 301);
          redirectResponse.headers.set('x-pathname', pathname);
          redirectResponse.headers.set('Content-Security-Policy', cspHeader);
          return redirectResponse;
        }
      }
    }
  } catch (err) {
    console.error('Redirect API error:', err);
  }

  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};