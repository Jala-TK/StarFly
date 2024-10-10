import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/prisma';
import crypto from 'crypto';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: async (profile) => {
        let user = await prisma.user.findFirst({
          where: {
            email: profile.email as string,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.name || profile.login,
              email: profile.email as string,
              image: profile.avatar_url,
              password: crypto.randomBytes(16).toString('hex'),
            },
          });
        }

        return {
          id: user.id,
          name: profile.name || profile.login,
          email: profile.email || null,
          image: profile.avatar_url,
        };
      },
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          console.log('User not found:', credentials.email);
          return null; // Retorne null se o usuário não for encontrado
        }

        const hash = crypto.createHash('sha256');
        hash.update(credentials.password as string);
        const hashedPassword = hash.digest('hex');

        if (user.password !== hashedPassword) {
          console.log('Invalid password for user:', user.email);
          return null; // Retorne null se a senha for inválida
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
