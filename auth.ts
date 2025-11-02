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
      if (user && user.id) {
        token.role = user.role;
        token.accountId = user.id;
        token.name = user.name;
        token.email = user.email;

        if (user.role === Role.USER) {
          try {
            const appUser = await prisma.user.findUnique({
              where: { id_akun: user.id },
              select: { id_user: true },
            });
            if (appUser) {
              token.userId = appUser.id_user;
            }
          } catch (e) {
            console.error("Gagal fetch id_user untuk token:", e);
          }
        } else if (user.role === Role.PENJUAL) {
          try {
            const appPenjual = await prisma.penjual.findUnique({
              where: { id_akun: user.id },
              select: { id_penjual: true },
            });
            if (appPenjual) {
              token.penjualId = appPenjual.id_penjual;
            }
          } catch (e) {
            console.error("Gagal fetch id_penjual untuk token:", e);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      
      if (session.user) {
        session.user.role = token.role;
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
      }

      if (token.role === Role.USER && token.userId) {
        session.user.id = token.userId;
      
      } else if (token.role === Role.PENJUAL && token.penjualId) {
        session.penjual = {
          id: token.penjualId,
          role: token.role,
          name: token.name || undefined,
          email: token.email || undefined,
        }; 
      } else if (token.role === Role.ADMIN) {
        session.user.id = token.accountId;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);