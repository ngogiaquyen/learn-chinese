import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const cards = await prisma.flashCard.findMany();
  return NextResponse.json(cards);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newCard = await prisma.flashCard.create({ data });
  return NextResponse.json(newCard);
}

export async function PUT(req: NextRequest) {
  const { id, chinese, pinyin, meaning } = await req.json();
  const updatedCard = await prisma.flashCard.update({
    where: { id },
    data: { chinese, pinyin, meaning },
  });
  return NextResponse.json(updatedCard);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.flashCard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
