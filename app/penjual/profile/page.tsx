// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { updatePenjualProfile, type FormState } from "@/lib/actions/penjual.actions"; 
// import PenjualEditForm from "@/components/PenjualEditForm"; 

// export default async function PenjualProfilePage() {
  
//   const session = await auth();
//   if (!session?.penjual?.id) {
//     redirect("/login");
//   }
  
//   const penjualWithAkun = await prisma.penjual.findUnique({
//     where: { id_penjual: session.penjual.id },
//     include: {
//       Akun: true,
//     },
//   });

//   if (!penjualWithAkun || !penjualWithAkun.Akun) {
//     return <div>Penjual atau data akun tidak ditemukan</div>;
//   }
  
//   const penjualProfileProps = {
//     ...penjualWithAkun,
//     akun: penjualWithAkun.Akun,
//   };

//   const updatePenjualWithIds = updatePenjualProfile.bind(
//     null,
//     penjualWithAkun.id_penjual,
//     penjualWithAkun.Akun.id_akun
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-4 md:p-6">
//       <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
//       <PenjualEditForm
//         penjualProfile={penjualProfileProps}
//         updatePenjualAction={
//             updatePenjualWithIds as (
//             prevState: FormState,
//             formData: FormData
//             ) => Promise<FormState>
//         }
//       />
//     </div>
//   );
// }


import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation"; // 'notFound' ditambahkan
import { prisma } from "@/lib/prisma";
import { updatePenjualProfile, type FormState } from "@/lib/actions/penjual.actions"; 
import PenjualEditForm from "@/components/PenjualEditForm"; 
import Link from "next/link"; // Ditambahkan untuk breadcrumbs

export default async function PenjualProfilePage() {
  
  const session = await auth();
  if (!session?.penjual?.id) {
    redirect("/login");
  }
  
  const penjualWithAkun = await prisma.penjual.findUnique({
    where: { id_penjual: session.penjual.id },
    include: {
      Akun: true,
    },
  });

  if (!penjualWithAkun || !penjualWithAkun.Akun) {
    // Menggunakan notFound() agar konsisten
    notFound();
  }
  
  const penjualProfileProps = {
    ...penjualWithAkun,
    akun: penjualWithAkun.Akun,
  };

  const updatePenjualWithIds = updatePenjualProfile.bind(
    null,
    penjualWithAkun.id_penjual,
    penjualWithAkun.Akun.id_akun
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
            <span className="text-slate-900 font-semibold">Edit Profile</span>
          </nav>
        </div>

        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon User/Profile */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Edit Profile
                  </h1>
                  <p className="text-sm text-purple-100">
                    Perbarui informasi akun dan data diri Anda di sini.
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
                 {/* Ikon Formulir */}
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Formulir Profile</h2>
                <p className="text-sm text-slate-600">Pastikan data yang Anda masukkan sudah benar.</p>
              </div>
            </div>
          </div>

          {/* Card Body (tempat form) */}
          <div className="p-4 sm:p-8">
            <PenjualEditForm
              penjualProfile={penjualProfileProps}
              updatePenjualAction={
                  updatePenjualWithIds as (
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