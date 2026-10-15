import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Si entra desde frenosconcon.atsit.cl y pide la raíz /, redirigir o servir /OT
  if (hostname.includes('frenosconcon.atsit.cl')) {
    const { pathname } = request.nextUrl;
    
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/OT', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
