import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_URL } from './config/config';

function buildCsp(nonce: string, isDev: boolean): string {
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
    img-src 'self' data: blob: https:;
    media-src 'self' https:;
    font-src 'self'
      https://fonts.gstatic.com
      https://cdn.jsdelivr.net
      data:;
    connect-src 'self'
      https://project-demo.in
      https://www.google-analytics.com
      https://analytics.google.com
      https://stats.g.doubleclick.net
      https://www.gstatic.com
      https://www.recaptcha.net;
    frame-src 'self'
      https://www.youtube.com
      https://youtube.com
      https://www.google.com
      https://www.gstatic.com
      https://www.recaptcha.net
      https://maps.google.com
      https://www.google.com/maps/
      https://maps.googleapis.com
      https://www.googletagmanager.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === 'development';
  const nonce = crypto.randomUUID();
  const cspHeader = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  // requestHeaders.set('x-nonce', nonce);
  // requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const slug = pathname.replace(/^\/+/, '');
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
        const newUrl = json.data.new_url;
        const redirectUrl = new URL(`/${newUrl.replace(/^\/+/, '')}`, request.url);

        if (
          redirectUrl.origin === request.nextUrl.origin &&
          redirectUrl.pathname !== pathname
        ) {
          const redirectResponse = NextResponse.redirect(redirectUrl, 301);
          redirectResponse.headers.set('x-pathname', pathname);
          return redirectResponse;
        }
      }
    }
  } catch (err) {
    console.error('Redirect API error:', err);
  }

  // response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],

};