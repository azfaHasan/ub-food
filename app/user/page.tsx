import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userData = await prisma.user.findUnique({
    where: { id_user: session.user.id },
    include: {
      Akun: { 
        select: { username: true, email: true }
      }
    }
  });

  if (!userData || !userData.Akun) {
    return <div>Data user tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl border-4 border-white/30">
                      <span className="text-4xl font-bold text-white">
                        {userData.nama_user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-10 h-10 rounded-xl bg-green-500 border-4 border-white shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Selamat datang! 👋
                  </h1>
                  <p className="text-xl font-semibold text-white/90 mb-3">
                    {userData.nama_user}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
                      @{userData.Akun.username}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
                      👤 User
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="self-start sm:self-center">
                  <LogoutButton/>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200">
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Pesanan</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Favorit</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Review</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Poin</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Informasi Profil</h2>
                      <p className="text-sm text-slate-600">Detail informasi akun Anda</p>
                    </div>
                  </div>
                  <Link 
                    href="/user/profile" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md group"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 group-hover:border-blue-300 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-600 mb-1">Nama Lengkap</p>
                        <p className="text-lg font-bold text-slate-900">{userData.nama_user}</p>
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-50 border border-slate-200 group-hover:border-blue-400 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-600 mb-1">Username</p>
                        <p className="text-lg font-bold text-slate-900">@{userData.Akun.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-50 border border-slate-200 group-hover:border-blue-400 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-600 mb-1">Email</p>
                        <p className="text-lg font-bold text-slate-900 truncate">{userData.Akun.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-50 border border-slate-200 group-hover:border--400 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-600 mb-1">Nomor Telepon</p>
                        {userData.no_hp_user ? (
                          <p className="text-lg font-bold text-slate-900">{userData.no_hp_user}</p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-medium text-slate-400 italic">Belum diisi</p>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">Opsional</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          {/* <div className="space-y-6"> */}
            {/* Account Settings */}
            {/* <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pengaturan
                </h3>
              </div>
              <div className="p-4">
                <nav className="space-y-2">
                  <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group">
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">Edit Profil</span>
                  </Link>
                  <Link href="/user/password" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group">
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">Ubah Password</span>
                  </Link>
                  <Link href="/user/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors group">
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-green-600">Notifikasi</span>
                  </Link>
                </nav>
              </div>
            </div> */}

            {/* Help Card */}
            {/* <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-white/90 mb-4">Hubungi support kami jika ada pertanyaan atau kendala</p>
              <button className="w-full px-4 py-2.5 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold text-sm shadow-lg">
                Hubungi Support
              </button>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}