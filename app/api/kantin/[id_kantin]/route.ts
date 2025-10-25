import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAkun } from "@/lib/auth";
import { Prisma } from "@prisma/client";

function parseTime(timeString: string | null | undefined): Date | null | undefined {
  if (timeString === null) return null;
  if (!timeString) return undefined;
  return new Date(`1970-01-01T${timeString}:00.000Z`);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id_kantin: string } }
) {
  try {
    const akun = await getAuthenticatedAkun();
    const kantinId = params.id_kantin;
    const body = await request.json();

    const kantin = await prisma.kantin.findUnique({
      where: { id_kantin: kantinId },
    });

    if (!kantin) {
      return NextResponse.json({ message: "Kantin tidak ditemukan" }, { status: 404 });
    }

    let hasAccess = false;
    if (akun.role === 'ADMIN') {
      hasAccess = true;
    } else if (akun.role === 'PENJUAL') {
      const penjualProfile = await prisma.penjual.findUnique({
        where: { id_akun: akun.id_akun }
      });
      if (penjualProfile && kantin.id_penjual === penjualProfile.id_penjual) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden: Anda tidak punya hak akses" }, { status: 403 });
    }

    const dataToUpdate: Prisma.KantinUpdateInput = {};
    
    if (body.nama_kantin) dataToUpdate.nama_kantin = body.nama_kantin;
    if (body.deskripsi_kantin) dataToUpdate.deskripsi_kantin = body.deskripsi_kantin;
    if (body.lokasi) dataToUpdate.lokasi = body.lokasi;
    
    const parsedBuka = parseTime(body.jam_buka);
    const parsedTutup = parseTime(body.jam_tutup);
    
    if (parsedBuka !== undefined) dataToUpdate.jam_buka = parsedBuka;
    if (parsedTutup !== undefined) dataToUpdate.jam_tutup = parsedTutup;

    const updatedKantin = await prisma.kantin.update({
      where: { id_kantin: kantinId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedKantin);

  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes("Unauthorized")) {
      	 	return NextResponse.json(
      	 	  { message: "Anda tidak punya akses" },
      	 	  { status: 401 }
      	 	);
        }

        return NextResponse.json(
            {message: "Internal Server Error", error: error.message},
            {status: 500}
        );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}