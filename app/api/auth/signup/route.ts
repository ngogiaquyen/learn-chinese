// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json();

  const exists = await prisma.user.findUnique({ where: { email } });
  
  if (exists) return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, passwordHash, username },
  });

  return NextResponse.json({ success: true });
}