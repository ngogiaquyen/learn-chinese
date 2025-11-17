// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

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

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username || user.email.split("@")[0],
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
    // Đưa id từ token vào session
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      // Tuỳ chọn: loại bỏ image nếu không muốn thấy undefined
      session.user.image = null; // hoặc delete session.user.image;
      return session;
    },

    // Đưa id vào token khi login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};