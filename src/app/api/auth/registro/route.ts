import { NextRequest, NextResponse } from 'next/server';
import { verifyBody } from '@/utils/verifyBody';
import { prisma } from '@/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!verifyBody(name) || !verifyBody(email) || !verifyBody(password)) {
      return NextResponse.json(
        { error: 'Os dados de nome, email e senha devem estar preenchidos.' },
        { status: 400 }
      );
    }

    // Verifica se o email já está cadastrado
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExists) {
      return NextResponse.json(
        { error: 'Email já cadastrado.' },
        { status: 400 }
      );
    }
    // Hash da password usando SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');

    // Cria um novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const message = {
      message: 'Usuário criado com sucesso!',
      user,
    };

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar o usuário.' },
      { status: 500 }
    );
  }
}
