import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { verifyBody } from '@/utils/verifyBody';
import { NextRequest, NextResponse } from 'next/server';

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  try {
    const { image } = await req.json();
    if (!verifyBody(image)) {
      return NextResponse.json(
        { error: 'Imagem é obrigatório' },
        { status: 400 }
      );
    }

    const email = req.auth.user.email as string;

    await prisma.user.update({
      where: { email },
      data: { image },
    });

    return NextResponse.json(
      { message: 'Imagem alterada com sucesso', image },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao alterar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar imagem.' },
      { status: 500 }
    );
  }
});
