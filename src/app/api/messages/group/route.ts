import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { verifyBody } from '@/utils/verifyBody';
import { NextRequest, NextResponse } from 'next/server';

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  try {
    const { groupId } = await req.json();
    if (!verifyBody(groupId)) {
      return NextResponse.json(
        { error: 'ID do Grupo é obrigatório' },
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

    const inGroup = await prisma.user_Group.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    if (!inGroup) {
      return NextResponse.json(
        { error: 'Você não está participando deste grupo.' },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
    });

    const messagesWithUser = await Promise.all(
      messages.map(async (message) => {
        const user = await prisma.user.findUnique({
          where: { id: message.userId },
          select: { name: true, email: true, image: true },
        });
        return { ...message, user };
      })
    );

    return NextResponse.json(messagesWithUser, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens.' },
      { status: 500 }
    );
  }
});
