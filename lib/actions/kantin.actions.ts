"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type FormState = {
  error: string | null;
  success: boolean;
};

function convertTimeToDate(timeString: string | null): Date | null {
  if (!timeString) return null;

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0); 
    return date;
  } catch (error) {
    console.error("Format waktu salah:", error);
    return null;
  }
}

export async function updateKantinProfile(
  kantinId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const deskripsi = formData.get("deskripsi_kantin") as string;
  const jamBukaString = formData.get("jam_buka") as string | null;
  const jamTutupString = formData.get("jam_tutup") as string | null;

  const session = await auth();
  if (!session?.penjual?.id) {
    return { error: "Anda tidak terautentikasi.", success: false };
  }
  
  const jam_buka = convertTimeToDate(jamBukaString);
  const jam_tutup = convertTimeToDate(jamTutupString);

  try {
    const kantin = await prisma.kantin.findFirst({
      where: {
        id_kantin: kantinId,
        id_penjual: session.penjual.id
      }
    });

    if (!kantin) {
      return { error: "Kantin tidak ditemukan atau Anda tidak ada hak akses.", success: false };
    }

    await prisma.kantin.update({
      where: { 
        id_kantin: kantinId 
      }, 
      data: {
        deskripsi_kantin: deskripsi,
        jam_buka: jam_buka,
        jam_tutup: jam_tutup,
      },
    });

  } catch (error) {
    console.error("Gagal update profil kantin:", error);
    return { error: "Gagal menyimpan data ke database.", success: false };
  }

  revalidatePath(`/penjual/kantin/${kantinId}`);
  revalidatePath(`/penjual/kantin/${kantinId}/profile`);
  
  redirect(`/penjual/kantin/${kantinId}`); 
}
