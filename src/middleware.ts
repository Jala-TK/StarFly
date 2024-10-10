import { auth } from '@/auth';

export default auth((req) => {
  if (!req.auth?.user) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (req.nextUrl.pathname === '/login') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|registro|socket.io).*)',
  ],
};
