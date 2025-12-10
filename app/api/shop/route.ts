// app/api/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // thay bằng path auth của bạn
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const [user, settings, ownedItems, shopItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    }),
    prisma.userShopSettings.findUnique({
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
    coins: user?.coins ?? 2500,
    inventory: ownedItems.map((i) => i.itemId),
    activePet: settings?.activePet ?? null,
    activeAvatar: settings?.activeAvatar ?? null,
    activeTheme: settings?.activeTheme ?? null,
    shopItems, // toàn bộ sản phẩm từ DB
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const body = await req.json();
  const { action, itemId, price } = body;

  // 1. MUA ITEM
  if (action === "buy") {
    // Kiểm tra đã sở hữu chưa
    const existing = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Bạn đã sở hữu vật phẩm này rồi!" }, { status: 400 });
    }

    // Kiểm tra đủ xu
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });
    if (!user || user.coins < price) {
      return NextResponse.json({ error: "Không đủ xu!" }, { status: 400 });
    }
    console.log({
        where: { id: userId },
        data: { coins: { decrement: price } },
      })
    // Giao dịch: trừ xu + thêm item
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { coins: { decrement: price } },
      }),
      prisma.userItem.create({
        data: {
          userId,
          itemId,
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "PURCHASE",
          amount: -price,
          itemId,
          description: `Mua vật phẩm ${itemId}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  }

  // 2. ĐẶT ITEM ĐANG SỬ DỤNG (active)
  if (action === "setActive") {
    const { type } = body; // "pet" | "avatar" | "theme"

    const field =
      type === "pet" ? "activePet" : type === "avatar" ? "activeAvatar" : "activeTheme";

    // Kiểm tra item có tồn tại và user đã sở hữu chưa
    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return NextResponse.json({ error: "Vật phẩm không tồn tại" }, { status: 404 });
    }
    if (item.type !== type.toUpperCase()) {
      return NextResponse.json({ error: "Loại vật phẩm không phù hợp" }, { status: 400 });
    }

    const owned = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (!owned) {
      return NextResponse.json({ error: "Bạn chưa sở hữu vật phẩm này" }, { status: 400 });
    }

    // Cập nhật active
    await prisma.userShopSettings.upsert({
      where: { userId },
      update: { [field]: itemId },
      create: {
        userId,
        [field]: itemId,
      },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
}