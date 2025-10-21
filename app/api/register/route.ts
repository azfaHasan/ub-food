import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, 
      username, 
      password, 
      role,
      nama,
    } = body;

    if (!email || !username || !password || !role || !nama) {
      return NextResponse.json({ message: "Data Tidak Lengkap atau Ada Kesalahan" }, { status: 400 });
    }

    if (role === Role.USER && !email.endsWith("@ub.ac.id")) {
      return NextResponse.json({ message: "Silahkan Gunakan Email Universitas Brawijaya!" }, { status: 400 });
    }
    
    const existingAkun = await prisma.akun.findFirst({
      where: { OR: [{ email }] }
    });

    if (existingAkun) {
      return NextResponse.json({ message: "Email terkait sudah terdaftar" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.$transaction(async (tx) => {
        const newAkun = await tx.akun.create({
          data: {
            email,
            username,
            password: hashedPassword,
            role: role as Role,
          },
        });

        if (role === Role.USER) {
          await tx.user.create({
            data: {
              nama_user: nama,
              id_akun: newAkun.id_akun,
            },
          });
        } else if (role === Role.PENJUAL) {
          await tx.penjual.create({
            data: {
              nama_penjual: nama,
              id_akun: newAkun.id_akun,
            },
          });
        }
      });

      return NextResponse.json({ message: "Registrasi berhasil" }, { status: 201 });

    } catch (txError) {
      console.error("Kesalahan Transaksi:", txError);
      return NextResponse.json({ message: "Terjadi kesalahan saat registrasi" }, { status: 500 });
    }

  } catch (error) {
    console.error("Kesalahan API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}