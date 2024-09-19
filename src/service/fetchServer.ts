'use server';
import { cookies, headers } from 'next/headers';

export const fetchServer = async (
  input: Request | string | URL,
  init?: RequestInit | undefined
) => {
  const headersa = headers();
  const host = headersa.get('host');

  const token = cookies().get('nextauth.token.starfly')?.value;

  const response = await fetch(`http://${host}/${input}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response;
};
