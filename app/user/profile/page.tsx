import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateUserProfile, type FormState } from "@/lib/actions/user.actions"; 
import UserEditForm from "@/components/UserEditForm"; 

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
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
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
  );
}
