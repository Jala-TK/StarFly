import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const rooms = await prisma.group.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(rooms, { status: 200 });
}
