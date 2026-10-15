import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Si entra desde frenosconcon.atsit.cl y pide la raíz /, servir la aplicación de OT
  if (hostname.includes('frenosconcon.atsit.cl')) {
    const { pathname } = request.nextUrl;
    
    // Si solicita la raíz o cualquier archivo que no esté en /OT
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/OT/index.html', request.url));
    }
    
    if (!pathname.startsWith('/OT') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
      return NextResponse.rewrite(new URL(`/OT${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
