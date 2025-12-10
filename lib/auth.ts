// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // sửa lại import đúng (thường là prisma)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        // Trả về object user chứa cả role
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username || user.email.split("@")[0],
          role: user.role || "USER", // lấy role từ database (mặc định USER nếu chưa có)
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },

  session: { strategy: "jwt" },

  callbacks: {
    // Đưa id + role vào token (khi login)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // ← thêm role vào token
      }
      return token;
    },

    // Đưa id + role từ token vào session (dùng ở client & server)
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        session.user.role = token.role as "USER" | "ADMIN"; // ← thêm role vào session
      }

      // Tùy chọn: loại bỏ image nếu không dùng
      session.user.image = null;

      return session;
    },
  },
};