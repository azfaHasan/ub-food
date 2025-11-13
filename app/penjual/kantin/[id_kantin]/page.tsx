export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { getAuthenticatedPenjual } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import MenuListItem from "@/components/MenuListItem";

interface DetailKantinPageProps {
  params: Promise<{
    id_kantin: string;
  }>;
}

function formatJam(date: Date | null): string {
  if (!date) return "Belum diatur";
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default async function DetailKantinPage({
  params,
}: DetailKantinPageProps) {

  const paramsNew = await params;

  let penjual;
  try {
    penjual = await getAuthenticatedPenjual();
  } catch (error) {
    redirect("/login");
  }

  if (!penjual) {
    return notFound();
  }

  const kantin = await prisma.kantin.findFirst({
    where: {
      id_kantin: paramsNew.id_kantin,
      id_penjual: penjual.id_penjual,
    },
  });

  if (!kantin) {
      notFound();
  }

  const daftarMenu = await prisma.menu.findMany({
    where: {
      id_kantin: paramsNew.id_kantin,
    },
    orderBy: {
      nama_menu: 'asc' 
    }
  });

  const baseUrl = `/penjual/kantin/${paramsNew.id_kantin}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/penjual" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Detail Kantin</span>
          </nav>
        </div>

        {/* Kantin Profile Card */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full uppercase tracking-wide">
                        Kantin Anda
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {kantin.nama_kantin}
                    </h1>
                    <p className="text-emerald-100 text-sm leading-relaxed max-w-2xl">
                      {kantin.deskripsi_kantin || "Penjual belum menambahkan deskripsi."}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/penjual/kantin/${kantin.id_kantin}/profile`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Lokasi Kantin</p>
                    <p className="text-lg font-semibold text-slate-900 truncate">
                      {kantin.lokasi || "Belum diatur"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Jam Operasi</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50">
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{daftarMenu.length}</div>
                <div className="text-xs text-slate-600 font-medium">Total Menu</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Pesanan Hari Ini</div>
              </div>
              {/* <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">4.5★</div>
                <div className="text-xs text-slate-600 font-medium">Rating</div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href={`${baseUrl}/orders`}
            className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">Pesanan</p>
                <p className="text-xs text-slate-600">Kelola pesanan</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  Daftar Menu
                </h2>
                <p className="text-slate-600 mt-1 ml-13">
                  {daftarMenu.length} menu tersedia
                </p>
              </div>
              <Link 
                href={`${baseUrl}/add-menu`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Menu Baru</span>
              </Link>
            </div>
          </div>

          <div className="p-8">
            {daftarMenu.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Menu</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Belum ada menu di kantin ini. Mulai tambahkan menu pertama untuk menarik pelanggan!
                </p>
                <Link 
                  href={`${baseUrl}/add-menu`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Tambah Menu Pertama</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {daftarMenu.map((menu) => (
                  <MenuListItem 
                    key={menu.id_menu} 
                    menu={menu} 
                    baseUrl={baseUrl} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}