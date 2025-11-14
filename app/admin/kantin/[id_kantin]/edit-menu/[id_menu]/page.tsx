import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateMenu, type FormState } from "@/lib/actions/menu.actions"; 
import MenuEditForm from "@/components/MenuEditForm";
import Link from "next/link";

interface EditMenuPageProps {
  params: Promise<{
    id_kantin: string;
    id_menu: string;
  }>;
}

export default async function AdminEditMenuPage({ params }: EditMenuPageProps) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    redirect("/login"); 
  }

  const paramsNew = await params;

  const menu = await prisma.menu.findUnique({
    where: { 
      id_menu: paramsNew.id_menu,
      id_kantin: paramsNew.id_kantin,
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              href={`/admin/kantin/${paramsNew.id_kantin}`} 
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Detail Kantin
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Edit Menu</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Edit Menu
                  </h1>
                  <p className="text-slate-100 text-lg font-medium">
                    {menu.nama_menu}
                  </p>
                </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full uppercase tracking-wide">
                      Admin Mode
                    </span>
                  </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700">
                  Perbarui informasi menu di bawah ini. Semua field dengan tanda bintang (<span className="text-red-500">*</span>) wajib diisi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Informasi Menu</h2>
                <p className="text-sm text-slate-600">Lengkapi form di bawah untuk memperbarui menu</p>
              </div>
            </div>
          </div>

          <div className="p-8">
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

        {/* Quick Actions */}
        <div className="mt-6 flex items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Butuh bantuan?</p>
              <p className="text-xs text-slate-600">Hubungi support jika mengalami kendala</p>
            </div> */}
          </div>
          <Link
            href={`/admin/kantin/${paramsNew.id_kantin}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Detail Kantin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}