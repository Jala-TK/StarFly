import { auth } from '@/auth';

export default auth((req) => {
  if (!req.auth?.user) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|registro|login|socket.io).*)',
  ],
};
