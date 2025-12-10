// app/api/admin/shop/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ← CHỖ DUY NHẤT CẦN SỬA
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // QUAN TRỌNG: phải await params
  const { id: rawId } = await context.params;
  const id = Number(rawId);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updated = await prisma.shopItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT shop item error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }
    return NextResponse.json({ error: "Lỗi server", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ← giống nhau cho cả DELETE
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    await prisma.shopItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}