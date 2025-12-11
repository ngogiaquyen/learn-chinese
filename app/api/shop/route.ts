// app/api/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
      where: { isActive: { not: false } },
      orderBy: { price: "asc" },
    }),
  ]);

  return NextResponse.json({
    coins: user?.coins ?? 2500,
    inventory: ownedItems.map((i) => i.itemId),
    activePet: settings?.activePet ?? null,
    activeAvatar: settings?.activeAvatar ?? null,
    activeTheme: settings?.activeTheme ?? null,
    shopItems,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const body = await req.json();
  const { action, itemId, toUserId, amount } = body;

  // NEW: LẤY LẠI SỐ XU HIỆN TẠI (siêu nhanh, dùng cho realtime)
  if (action === "getCoins") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });

    return NextResponse.json({
      success: true,
      coins: user?.coins ?? 0,
    });
  }

  // ================== MUA ITEM ==================
  if (action === "buy") {
    const { price } = body;
    if (!itemId || !price) {
      return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
    }

    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item || item.price !== price) {
      return NextResponse.json(
        { error: "Vật phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const existing = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bạn đã sở hữu vật phẩm này!" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.coins < price) {
      return NextResponse.json({ error: "Không đủ xu!" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { coins: { decrement: price } },
      }),
      prisma.userItem.create({
        data: { userId, itemId },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "PURCHASE",
          amount: -price,
          itemId,
          description: `Mua "${item.name}"`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, coins: user.coins - price });
  }

  // ================== ĐẶT ACTIVE ==================
  if (action === "setActive") {
    const { type } = body;
    if (!["pet", "avatar", "theme"].includes(type)) {
      return NextResponse.json({ error: "Loại không hợp lệ" }, { status: 400 });
    }

    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item)
      return NextResponse.json(
        { error: "Không tìm thấy vật phẩm" },
        { status: 404 }
      );

    const owned = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Bạn chưa sở hữu vật phẩm này" },
        { status: 400 }
      );
    }

    const field =
      type === "pet"
        ? "activePet"
        : type === "avatar"
        ? "activeAvatar"
        : "activeTheme";

    await prisma.userShopSettings.upsert({
      where: { userId },
      update: { [field]: itemId },
      create: { userId, [field]: itemId },
    });

    return NextResponse.json({ success: true });
  }

  // ================== BÁN LẠI ITEM ==================
  if (action === "sell") {
    if (!itemId) {
      return NextResponse.json({ error: "Thiếu itemId" }, { status: 400 });
    }

    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return NextResponse.json(
        { error: "Vật phẩm không tồn tại" },
        { status: 404 }
      );
    }

    const owned = await prisma.userItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Bạn không sở hữu vật phẩm này" },
        { status: 400 }
      );
    }

    const refundAmount = Math.floor(item.price * 0.7);

    await prisma.$transaction(async (tx) => {
      await tx.userItem.delete({
        where: { userId_itemId: { userId, itemId } },
      });

      await tx.user.update({
        where: { id: userId },
        data: { coins: { increment: refundAmount } },
      });

      const settings = await tx.userShopSettings.findUnique({
        where: { userId },
      });
      if (settings) {
        const updates: any = {};
        if (settings.activePet === itemId) updates.activePet = null;
        if (settings.activeAvatar === itemId) updates.activeAvatar = null;
        if (settings.activeTheme === itemId) updates.activeTheme = null;
        if (Object.keys(updates).length > 0) {
          await tx.userShopSettings.update({
            where: { userId },
            data: updates,
          });
        }
      }

      await tx.transaction.create({
        data: {
          userId,
          type: "SELL",
          amount: refundAmount,
          itemId,
          description: `Bán lại "${item.name}"`,
        },
      });
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });

    return NextResponse.json({
      success: true,
      coins: updatedUser?.coins ?? 0,
      message: `Đã bán "${
        item.name
      }" và nhận ${refundAmount.toLocaleString()} xu`,
    });
  }

  // ================== CHUYỂN XU (TRANSFER) ==================
  if (action === "transfer") {
    if (!toUserId || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Thiếu hoặc số xu không hợp lệ" },
        { status: 400 }
      );
    }

    const recipientId = Number(toUserId);
    const transferAmount = Number(amount);

    if (recipientId === userId) {
      return NextResponse.json(
        { error: "Không thể chuyển cho chính mình" },
        { status: 400 }
      );
    }

    if (isNaN(recipientId) || isNaN(transferAmount)) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    let senderUsername = "";
    let recipientUsername = "";

    await prisma.$transaction(async (tx) => {
      // Kiểm tra người gửi
      const sender = await tx.user.findUnique({
        where: { id: userId },
        select: { coins: true, username: true },
      });
      if (!sender || sender.coins < transferAmount) {
        throw new Error("Không đủ xu");
      }

      // Kiểm tra người nhận
      const recipient = await tx.user.findUnique({
        where: { id: recipientId },
        select: { username: true, coins: true },
      });
      if (!recipient) {
        throw new Error("Người nhận không tồn tại");
      }

      // Trừ xu người gửi
      await tx.user.update({
        where: { id: userId },
        data: { coins: { decrement: transferAmount } },
      });

      // Cộng xu người nhận
      await tx.user.update({
        where: { id: recipientId },
        data: { coins: { increment: transferAmount } },
      });

      // Ghi lịch sử giao dịch cho người gửi
      await tx.transaction.create({
        data: {
          userId,
          type: "TRANSFER_OUT",
          amount: -transferAmount,
          toUserId: recipientId,
          description: `Chuyển ${transferAmount.toLocaleString()} xu cho ${recipientUsername}`,
        },
      });

      // Ghi lịch sử giao dịch cho người nhận
      await tx.transaction.create({
        data: {
          userId: recipientId,
          type: "TRANSFER_IN",
          amount: transferAmount,
          fromUserId: userId,
          description: `Nhận ${transferAmount.toLocaleString()} xu từ ${senderUsername}`,
        },
      });
    });

    // Lấy lại số xu mới của người gửi
    const updatedSender = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });

    return NextResponse.json({
      success: true,
      coins: updatedSender?.coins ?? 0,
      message: `Đã chuyển ${transferAmount.toLocaleString()} xu thành công!`,
    });
  }

  // ================== ACTION KHÔNG HỢP LỆ ==================
  return NextResponse.json(
    { error: "Hành động không hợp lệ" },
    { status: 400 }
  );
}
