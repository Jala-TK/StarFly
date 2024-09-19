'use client';
import { parseCookies } from 'nookies';

export const fetchClient = async (
  input: Request | string | URL,
  init?: RequestInit | undefined
) => {
  const { 'nextauth.token.rhmix': token } = parseCookies();

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response;
};
