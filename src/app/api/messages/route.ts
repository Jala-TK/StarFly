import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para lidar com requisições GET (buscar todas as mensagens)
export async function GET() {
  try {
    // Busca todas as mensagens no banco de dados
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Retorna as mensagens como JSON
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens.' },
      { status: 500 }
    );
  }
}

// Função para lidar com requisições POST (salvar uma nova mensagem)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'O conteúdo da mensagem não pode estar vazio.' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar a mensagem.' },
      { status: 500 }
    );
  }
}
