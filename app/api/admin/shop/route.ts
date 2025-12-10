// app/api/admin/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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
  } catch (error) {
    return NextResponse.json({ error: "Thêm sản phẩm thất bại" }, { status: 400 });
  }
}