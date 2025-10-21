import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const role = credentials.role as Role;

        const akun = await prisma.akun.findUnique({
          where: { email: email },
        });

        if (!akun) {
          console.log("Akun tidak ditemukan");
          return null;
        }

        if (akun.role !== role) {
          console.log("Role tidak cocok");
          return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, akun.password);

        if (!isPasswordMatch) {
          console.log("Password salah");
          return null;
        }

        // Return data user sesuai dengan tipe 'User' di next-auth.d.ts
        return {
          id: akun.id_akun,
          email: akun.email,
          role: akun.role,
          name: akun.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    // [FIX #3] 'session' dan 'token' sekarang memiliki tipe yang benar
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // 'sub' adalah 'id' user
        session.user.role = token.role; // 'token.role' dari callback jwt
      }
      return session; // <- Tidak perlu 'as any' lagi
    },
  },
  pages: {
    signIn: "/",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);