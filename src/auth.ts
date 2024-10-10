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
        let user = null;
        let password: string = (credentials.password as string).toString();

        user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error('User not found.');
        }

        // Hash da password usando SHA-256
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        // Verifica se a senha é válida
        if (user.password !== hashedPassword) {
          throw new Error('Invalid password.');
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
      // Adiciona o id do usuário ao token JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona o id do token à sessão
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
