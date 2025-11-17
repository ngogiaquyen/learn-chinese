import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getFlashCardsByStatus(status: "NOT_LEARNED" | "LEARNING" | "REVIEW" | "MASTERED") {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Nếu chưa đăng nhập thì không có userStatus → trả về rỗng
    return [];
  }

  const userId = parseInt(session.user.id);

  const cards = await prisma.FlashCard.findMany({
    include: {
      userStatus: {
        where: { userId, status },
      },
    },
    orderBy: { id: "asc" },
  });

  // Chỉ giữ những card có trạng thái đúng
  return cards
    .filter(card => card.userStatus.length > 0)
    .map(card => ({
      id: card.id,
      chinese: card.chinese,
      pinyin: card.pinyin,
      meaning: card.meaning,
      status: status,
    }));
}
