import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { verifyBody } from '@/utils/verifyBody';

// Função para lidar com requisições POST (salvar uma nova mensagem)
export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  try {
    const { groupId, content } = await req.json();
    if (!verifyBody(groupId) || !verifyBody(content)) {
      return NextResponse.json(
        { error: 'Argumentos faltando' },
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
    const message = await prisma.message.create({
      data: {
        content,
        groupId,
        userId,
        email,
      },
    });

    await prisma.group.update({
      where: { id: groupId },
      data: { updatedAt: new Date() },
    });

    const messageWithUser = {
      ...message,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };

    return NextResponse.json(messageWithUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar a mensagem.' },
      { status: 500 }
    );
  }
});
