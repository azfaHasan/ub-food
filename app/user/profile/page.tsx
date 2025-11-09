import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateUserProfile, type FormState } from "@/lib/actions/user.actions"; 
import UserEditForm from "@/components/UserEditForm";
import Link from "next/link";

export default async function UserProfilePage() {
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const userWithAkun = await prisma.user.findUnique({
    where: { id_user: session.user.id },
    include: {
      Akun: true,
    },
  });

  if (!userWithAkun || !userWithAkun.Akun) {
    return <div>User atau data akun tidak ditemukan</div>;
  }
  
  const userProfileProps = {
    ...userWithAkun,
    akun: userWithAkun.Akun,
  };

  const updateUserWithIds = updateUserProfile.bind(
    null,
    userWithAkun.id_user,
    userWithAkun.Akun.id_akun
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/user" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Edit Profile</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full uppercase tracking-wide">
                      User Profile
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Edit Profile
                  </h1>
                  <p className="text-purple-100 text-base">
                    Perbarui informasi profil dan pengaturan akun Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {userWithAkun.nama_user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-white border-2 border-slate-200 shadow-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{userWithAkun.nama_user}</h3>
                  <p className="text-sm text-slate-600">@{userWithAkun.Akun.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                      Ubah Foto
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Hapus Foto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Pastikan informasi yang Anda masukkan akurat dan up-to-date. Field dengan tanda bintang (<span className="text-red-500 font-semibold">*</span>) wajib diisi.
                  </p>
                </div>
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
                <h2 className="text-xl font-bold text-slate-900">Informasi Personal</h2>
                <p className="text-sm text-slate-600">Update data pribadi dan kontak Anda</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <UserEditForm
              userProfile={userProfileProps}
              updateUserAction={
                  updateUserWithIds as (
                  prevState: FormState,
                  formData: FormData
                  ) => Promise<FormState>
              }
            />
          </div>
        </div>

        {/* Account Security Section */}
        <div className="mt-6 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Keamanan Akun</h2>
                <p className="text-sm text-slate-600">Kelola password dan pengaturan keamanan</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <Link 
                href="/user/password" 
                className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">Ubah Password</p>
                    <p className="text-sm text-slate-600">Update password akun Anda</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5 flex items-center gap-2">
                      Two-Factor Authentication
                      <span className="px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">Aktif</span>
                    </p>
                    <p className="text-sm text-slate-600">Keamanan ekstra untuk akun Anda</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium bg-white text-green-700 rounded-xl hover:bg-green-50 transition-colors border border-green-200">
                  Kelola
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Perlu bantuan?</p>
              <p className="text-xs text-slate-600">Hubungi support untuk bantuan</p>
            </div> */}
          </div>
          <div className="flex gap-3">
            <Link
              href="/user"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali</span>
            </Link>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md">
              <span>Bantuan</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}