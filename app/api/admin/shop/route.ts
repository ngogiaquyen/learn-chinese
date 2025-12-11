// app/api/admin/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET: Lấy danh sách tất cả sản phẩm
export async function GET() {
  const session = await getServerSession(authOptions);

  // Kiểm tra quyền admin (bạn cần thêm role vào User model nếu chưa có)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.shopItem.findMany({
    orderBy: { type: "asc" },
  });

  return NextResponse.json(items);
}

// POST: Thêm sản phẩm mới
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  try {
    const newItem = await prisma.shopItem.create({ data });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error("Thêm sản phẩm thất bại:", error);

    // Xử lý lỗi Prisma phổ biến (ví dụ: duplicate key, not found, v.v.)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // unique constraint failed
        return NextResponse.json(
          { error: "Tên sản phẩm hoặc mã đã tồn tại" },
          { status: 400 }
        );
      }
      // Các mã lỗi khác nếu cần
    }

    // Lỗi chung
    const message =
      error instanceof Error ? error.message : "Lỗi không xác định";

    return NextResponse.json(
      { error: "Thêm sản phẩm thất bại", details: message },
      { status: 500 }
    );
  }
}
