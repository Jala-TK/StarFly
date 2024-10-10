import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyBody } from '@/utils/verifyBody';
import { prisma } from '@/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!verifyBody(email) || !verifyBody(password)) {
      return NextResponse.json(
        { error: 'Os dados de email e senha devem estar preenchidos.' },
        { status: 400 }
      );
    }

    // Verifica se o usuário existe
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    // Hash da password usando SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');

    // Verifica se a senha é válida
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: 'Senha inválida.' }, { status: 401 });
    }

    const message = {
      message: 'Usuário encontrado com sucesso!',
      user,
    };

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}
