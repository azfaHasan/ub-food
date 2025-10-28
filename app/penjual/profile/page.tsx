import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePenjualProfile, type FormState } from "@/lib/actions/penjual.actions"; 
import PenjualEditForm from "@/components/PenjualEditForm"; 

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
    return <div>Penjual atau data akun tidak ditemukan</div>;
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
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
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
  );
}
