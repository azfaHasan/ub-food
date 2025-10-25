import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedPenjual } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id_kantin: string } }
) {
  try {
    const penjual = await getAuthenticatedPenjual();
    const kantinId = params.id_kantin;
    const body = await request.json();
    
    const { 
      nama_menu, 
      harga_menu,
      deskripsi_menu, 
      stok_menu,
      foto_menu 
    } = body;

    const kantin = await prisma.kantin.findFirst({
      where: {
        id_kantin: kantinId,
        id_penjual: penjual.id_penjual,
      },
    });

    if (!kantin) {
      return NextResponse.json(
        { message: "Forbidden: Anda tidak punya akses ke kantin ini" },
        { status: 403 }
      );
    }

    if (!nama_menu || !harga_menu) {
      return NextResponse.json(
        { message: "Nama menu dan harga menu wajib diisi" },
        { status: 400 }
      );
    }

    const harga = parseFloat(harga_menu);
    const stok = stok_menu ? parseInt(stok_menu) : 0;

    if (isNaN(harga) || isNaN(stok)) {
       return NextResponse.json(
        { message: "Harga dan stok harus berupa angka" },
        { status: 400 }
      );
    }
    
    const newMenu = await prisma.menu.create({
        data: {
            nama_menu,
            harga_menu: harga,
            deskripsi_menu,
            stok_menu: stok,
            foto_menu,
            id_kantin: kantinId
        }
    });

    return NextResponse.json(newMenu, { status: 201 });

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