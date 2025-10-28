"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export type FormState = {
  error: string | null;
  success: boolean;
};

export async function updateUserProfile(
  userId: string,
  accountId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const nomor_hp = formData.get("nomor_hp") as string;

  if (!nama || !username) {
    return { error: "Nama dan Username tidak boleh kosong.", success: false };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Anda tidak terautentikasi.", success: false };
  }
  
  try {
    await prisma.$transaction([
      prisma.akun.update({
        where: { id_akun: accountId },
        data: {
          username: username,
        },
      }),
      prisma.user.update({
        where: { id_user: userId },
        data: {
          nama_user: nama,
          no_hp_user: nomor_hp,
        },
      }),
    ]);
  } catch (error) {
    console.error("Gagal update profile:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
       if (error.code === "P2002") {
            if (Array.isArray(error.meta?.target) && error.meta.target.includes('username')) {
                return { error: "Username tersebut sudah digunakan.", success: false };
            }
       }
    }
    return { error: "Gagal menyimpan data ke database.", success: false };
  }

  revalidatePath("/user");
  revalidatePath("/user/profile");
  
  redirect("/user"); 
}
