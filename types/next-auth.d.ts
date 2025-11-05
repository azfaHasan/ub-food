import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    accountId: string;
    userId?: string;
    penjualId?: string;
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      akunId: string;
      role: Role;
    } & DefaultSession["user"];

    penjual?: {
      id: string;
      role: Role;
      name?: string
      email?: string;
    };


  }
}