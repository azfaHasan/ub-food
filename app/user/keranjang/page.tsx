import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { redirect } from "next/navigation";
import HapusItemButton from "@/components/HapusItemButton";
import FinalisasiForm from "./FinalisasiForm";

export default async function KeranjangPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const keranjang = await prisma.keranjang.findUnique({
    where: { id_user: session.user.id },
    include: {
      DetailKeranjang: {
        include: {
          Menu: {
            include: {
              Kantin: {
                select: { nama_kantin: true }
              }
            }
          }
        },
        orderBy: {
          Menu: { nama_menu: 'asc' }
        }
      }
    }
  });

  const items = keranjang?.DetailKeranjang || [];  
  const kantinNama = items.length > 0 ? items[0].Menu.Kantin.nama_kantin : null;
  const totalHarga = items.reduce((total, item) => {
    return total + (item.jumlah * item.Menu.harga_menu);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Keranjang Anda</h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-500">Keranjang Anda masih kosong.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-2">Keranjang Anda</h1>
      {kantinNama && (
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Pesanan dari: {kantinNama}
        </h2>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Item Pesanan</h3>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id_detail_keranjang} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.Menu.nama_menu}</p>
                  <p className="text-sm text-gray-500">
                    {item.jumlah} x {formatRupiah(item.Menu.harga_menu)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatRupiah(item.jumlah * item.Menu.harga_menu)}
                  </p>
                  <HapusItemButton id_detail_keranjang={item.id_detail_keranjang} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border-t border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Total Harga</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatRupiah(totalHarga)}
            </p>
          </div>
        </div>
        <FinalisasiForm />
      </div>
    </div>
  );
}