import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateKantinProfile, type FormState } from "@/lib/actions/kantin.actions"; 
import KantinEditForm from "@/components/KantinEditForm"; 

interface EditKantinPageProps {
  params: {
    id_kantin: string;
  };
}

export default async function EditKantinProfilePage({ params }: EditKantinPageProps) {
  const session = await auth();
  
  if (!session?.penjual?.id) {
    redirect("/login");
  }

  const kantin = await prisma.kantin.findFirst({
    where: { 
      id_kantin: params.id_kantin,
      id_penjual: session.penjual.id
    },
  });

  if (!kantin) {
    notFound();
  }
  
  const updateKantinWithId = updateKantinProfile.bind(
    null,
    kantin.id_kantin
  );

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile Kantin: {kantin.nama_kantin}</h1>
      <KantinEditForm
        kantin={kantin} 
        updateKantinAction={
          updateKantinWithId as (
            prevState: FormState,
            formData: FormData
          ) => Promise<FormState>
        }
      />
    </div>
  );
}
