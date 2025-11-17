// app/api/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("Session in /api/progress:", session);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { flashcardId, status } = await req.json();
  const userId = parseInt(session.user.id);

  await prisma.userFlashcardStatus.upsert({
    where: { userId_flashcardId: { userId, flashcardId } },
    update: { status, lastReviewedAt: new Date() },
    create: { userId, flashcardId, status, lastReviewedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}