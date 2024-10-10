// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyBody } from '@/utils/verifyBody';
import { prisma } from '@/prisma';
import { auth } from '@/auth';

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

    const group = await prisma.group.findFirst({ where: { id: groupId } });
    if (!group) {
      return NextResponse.json(
        { error: 'Grupo não encontrada' },
        { status: 404 }
      );
    }

    // Verifica se o usuário já está no grupo
    const userInGroup = await prisma.user_Group.findFirst({
      where: {
        userId,
        groupId,
      },
    });
    if (userInGroup) {
      return NextResponse.json(
        { error: 'Usuário já está no grupo.' },
        { status: 409 }
      );
    }

    // Adicionar um novo usuário ao grupo
    await prisma.user_Group.create({
      data: {
        groupId,
        userId,
      },
    });

    return NextResponse.json(
      { message: 'Usuário adicionado ao grupo com sucesso!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao adicionar usuário ao grupo:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar o usuário ao grupo.' },
      { status: 500 }
    );
  }
});
