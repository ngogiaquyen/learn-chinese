import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getFlashCards() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const cards = await prisma.flashCard.findMany({
      orderBy: { id: "asc" },
    });
    return cards.map(c => ({
      id: c.id,
      chinese: c.chinese,
      pinyin: c.pinyin,
      meaning: c.meaning,
      status: "NOT_LEARNED" as const,
    }));
  }

  const userId = parseInt(session.user.id);

  const cards = await prisma.flashCard.findMany({
    include: {
      userStatus: {
        where: { userId },
      },
    },
    orderBy: { id: "asc" },
  });

  return cards.map(card => ({
    id: card.id,
    chinese: card.chinese,
    pinyin: card.pinyin,
    meaning: card.meaning,
    status: (card.userStatus[0]?.status || "NOT_LEARNED"),
  }));
}
