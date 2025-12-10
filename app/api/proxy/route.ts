// app/api/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const [settings, ownedItems, shopItems] = await Promise.all([
    prisma.user_shop_settings.findUnique({
      where: { userId },
      select: { activePet: true, activeAvatar: true, activeTheme: true },
    }),
    prisma.userItem.findMany({
      where: { userId },
      select: { itemId: true },
    }),
    prisma.shopItem.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    }),
  ]);

  return NextResponse.json({
    coins: session.user.coins ?? 2500, // lấy từ User
    inventory: ownedItems.map(i => i.itemId),
    activePet: settings?.activePet ?? null,
    activeAvatar: settings?.activeAvatar ?? null,
    activeTheme: settings?.activeTheme ?? null,
    shopItems, // toàn bộ sản phẩm từ DB
  });
}

// POST giữ nguyên như trước (buy + setActive)