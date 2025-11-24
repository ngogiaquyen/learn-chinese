import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getFlashCardsByStatus(
  status: "NOT_LEARNED" | "LEARNING" | "REVIEW" | "MASTERED"
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  console.log(status);

  const userId = Number(session.user.id);

  if (status === "NOT_LEARNED") {
    // Lấy những flashcard mà KHÔNG có userStatus nào với userId
    const cards = await prisma.flashCard.findMany({
      where: {
        userStatus: {
          none: { userId },
        },
      },
      orderBy: { id: "asc" },
      select: {
        id: true,
        chinese: true,
        pinyin: true,
        meaning: true,
        hskLevel: true,
      },
    });

    return cards.map((card) => ({
      ...card,
      status: "NOT_LEARNED" as
        | "NOT_LEARNED"
        | "LEARNING"
        | "REVIEW"
        | "MASTERED",
    }));
  }

  // Các trạng thái khác thì query bình thường
  const statuses = await prisma.userFlashcardStatus.findMany({
    where: { userId, status },
    orderBy: { updatedAt: "desc" },
    include: {
      flashcard: {
        select: {
          id: true,
          chinese: true,
          pinyin: true,
          meaning: true,
          hskLevel: true,
        },
      },
    },
  });

  return statuses.map((s) => ({
    id: s.flashcard.id,
    chinese: s.flashcard.chinese,
    pinyin: s.flashcard.pinyin,
    meaning: s.flashcard.meaning,
    hskLevel: s.flashcard.hskLevel,
    status: s.status as "NOT_LEARNED" | "LEARNING" | "REVIEW" | "MASTERED",
  }));
}
