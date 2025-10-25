import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function getAuthenticatedAkun() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const akun = await prisma.akun.findUnique({
    where: { email: session.user.email },
  });

  if (!akun) {
    throw new Error("Akun tidak ditemukan");
  }

  return akun;
}

export async function getAuthenticatedPenjual() {
  const akun = await getAuthenticatedAkun();

  if (akun.role !== 'PENJUAL') {
     throw new Error("Unauthorized: Bukan Penjual");
  }

  const penjual = await prisma.penjual.findUnique({
    where: { id_akun: akun.id_akun }
  });

  if (!penjual) {
     throw new Error("Profil Penjual tidak ditemukan");
  }

  return penjual;
}