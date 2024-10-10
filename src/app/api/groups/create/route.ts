import { NextRequest, NextResponse } from 'next/server';
import { verifyBody } from '@/utils/verifyBody';
import { prisma } from '@/prisma';
import { auth } from '@/auth';

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  try {
    const { name } = await req.json();

    if (!verifyBody(name)) {
      return NextResponse.json(
        { error: 'Nome da sala é obrigatório' },
        { status: 400 }
      );
    }

    const email = req.auth.user.email as string;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 400 }
      );
    }
    const userId = user.id;

    // Cria uma nova sala
    const group = await prisma.group.create({
      data: {
        name,
        User_Group: {
          create: {
            userId,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Grupo criado com sucesso!', group },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar grupo.' },
      { status: 500 }
    );
  }
});
