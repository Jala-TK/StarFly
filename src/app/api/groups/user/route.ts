// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { auth } from '@/auth';

export const GET = auth(async function POST(req: NextRequest & { auth: any }) {
  try {
    const email = req.auth.user.email as string;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 400 }
      );
    }
    const userId = user.id;

    const groupsUser = await prisma.user_Group.findMany({
      where: {
        userId,
      },
    });

    const groups = await prisma.group.findMany({
      where: { id: { in: groupsUser.map((group) => group.groupId) } },
      orderBy: { updatedAt: 'desc' },
    });

    const message = {
      message: 'Grupos do usuario buscados com sucesso!',
      groups,
    };
    const groupMessages = await Promise.all(
      groups.map(async (group) => {
        const lastMessage = await prisma.message.findFirst({
          where: { groupId: group.id },
          orderBy: { createdAt: 'desc' },
        });
        return {
          ...group,
          lastMessage: lastMessage ? lastMessage : null,
        };
      })
    );

    message.groups = groupMessages;

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar grupos.' },
      { status: 500 }
    );
  }
});
