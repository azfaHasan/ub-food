// import { auth } from "@/auth";
// import { redirect, notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { Role } from "@prisma/client";
// import { updateMenu, type FormState } from "@/lib/actions/menu.actions"; 
// import MenuEditForm from "@/components/MenuEditForm"; 
// import { type Session } from "next-auth";

// interface EditMenuPageProps {
//   params: {
//     id_kantin: string;
//     id_menu: string;
//   };
// }

// async function canModifyMenu(kantinId: string, session: Session | null) {
//   if (!session) return false;

//   if (session.user.role === Role.ADMIN) return true;

//   if (session.penjual?.id) {
//     const kantin = await prisma.kantin.findFirst({
//       where: { id_kantin: kantinId, id_penjual: session.penjual.id },
//     });
//     return !!kantin;
//   }
//   return false;
// }

// export default async function EditMenuPage({ params }: EditMenuPageProps) {
  
//   const session = await auth();
//   const hasAccess = await canModifyMenu(params.id_kantin, session);
  
//   if (!hasAccess) {
//     redirect("/login");
//   }

//   const menu = await prisma.menu.findUnique({
//     where: { 
//       id_menu: params.id_menu,
//       id_kantin: params.id_kantin,
//     },
//   });

//   if (!menu) {
//     notFound();
//   }
  
//   const updateMenuWithIds = updateMenu.bind(
//     null,
//     menu.id_menu,
//     menu.id_kantin
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-2xl font-bold mb-6">Edit Menu: {menu.nama_menu}</h1>
//       <MenuEditForm
//         menu={menu} 
//         updateMenuAction={
//           updateMenuWithIds as (
//             prevState: FormState,
//             formData: FormData
//           ) => Promise<FormState>
//         }
//       />
//     </div>
//   );
// }


import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateMenu, type FormState } from "@/lib/actions/menu.actions"; 
import MenuEditForm from "@/components/MenuEditForm"; 
import { type Session } from "next-auth";
import Link from "next/link"; // Ditambahkan untuk breadcrumbs

interface EditMenuPageProps {
  params: {
    id_kantin: string;
    id_menu: string;
  };
}

async function canModifyMenu(kantinId: string, session: Session | null) {
  if (!session) return false;

  if (session.user.role === Role.ADMIN) return true;

  // Asumsi dari kode Anda, penjual ada di session.penjual.id
  // Jika menggunakan id_akun dari session.user.akunId, sesuaikan di sini
  const penjualId = session.penjual?.id; // Sesuaikan ini jika perlu
  
  if (penjualId) {
    const kantin = await prisma.kantin.findFirst({
      where: { id_kantin: kantinId, id_penjual: penjualId },
    });
    return !!kantin;
  }
  
  // Jika 'session.penjual.id' tidak ada, mungkin Anda perlu
  // mengecek berdasarkan 'session.user.akunId' ke tabel Penjual.
  // Tapi saya akan ikuti logika asli Anda.
  
  return false;
}

export default async function EditMenuPage({ params }: EditMenuPageProps) {
  
  const session = await auth();
  const hasAccess = await canModifyMenu(params.id_kantin, session);
  
  if (!hasAccess) {
    // Arahkan ke login penjual jika lebih sesuai
    redirect("/login/penjual"); 
  }

  const menu = await prisma.menu.findUnique({
    where: { 
      id_menu: params.id_menu,
      id_kantin: params.id_kantin,
    },
  });

  if (!menu) {
    notFound();
  }
  
  const updateMenuWithIds = updateMenu.bind(
    null,
    menu.id_menu,
    menu.id_kantin
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/penjual" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/penjual/kantin/${params.id_kantin}`} className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Detail Kantin
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Edit Menu</span>
          </nav>
        </div>

        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon Edit */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Edit Menu
                  </h1>
                  <p className="text-lg text-purple-100 font-medium truncate" title={menu.nama_menu}>
                    {menu.nama_menu}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Formulir Edit Menu</h2>
                <p className="text-sm text-slate-600">Perbarui informasi untuk menu ini</p>
              </div>
            </div>
          </div>

          {/* Card Body (tempat form) */}
          <div className="p-4 sm:p-8">
            <MenuEditForm
              menu={menu} 
              updateMenuAction={
                updateMenuWithIds as (
                  prevState: FormState,
                  formData: FormData
                ) => Promise<FormState>
              }
            />
          </div>
        </div>

      </div>
    </div>
  );
}