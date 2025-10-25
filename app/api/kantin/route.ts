// app/api/kantin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedPenjual } from "@/lib/auth";
import { Prisma } from "@prisma/client";

function parseTime(timeString: string | null | undefined): Date | null {
  if (!timeString) return null;
  return new Date(`1970-01-01T${timeString}:00.000Z`);
}

export async function POST(request: Request) {
  try {
    const penjual = await getAuthenticatedPenjual();
    const body = await request.json();
    
    const {
      nama_kantin,
      jam_buka,
      jam_tutup,
      deskripsi_kantin,
      lokasi,
    } = body;

    if (!nama_kantin) {
      return NextResponse.json(
        { message: "Nama kantin wajib diisi" },
        { status: 400 }
      );
    }

    const dataKantin: Prisma.KantinCreateInput = {
      nama_kantin,
      deskripsi_kantin,
      lokasi,
      Penjual: {connect: {id_penjual: penjual.id_penjual}}
    };

    const parsedBuka = parseTime(jam_buka);
    const parsedTutup = parseTime(jam_tutup);
    
    if (parsedBuka) dataKantin.jam_buka = parsedBuka;
    if (parsedTutup) dataKantin.jam_tutup = parsedTutup;

    const newKantin = await prisma.kantin.create({
      data: dataKantin,
    });

    return NextResponse.json(newKantin, { status: 201 });
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
      { message: "Internal Server Error", error: "An unknown error occurred"},
      { status: 500 }
    );
  }
}