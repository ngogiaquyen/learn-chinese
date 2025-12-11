import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: int;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "USER" | "ADMIN";
      coins: number | 0;
    };
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string; // hoặc number tùy bạn dùng
    role?: Role; // hoặc Role nếu dùng enum
  }

  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}