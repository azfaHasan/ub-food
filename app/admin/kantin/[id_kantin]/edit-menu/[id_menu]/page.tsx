import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateMenu, type FormState } from "@/lib/actions/menu.actions"; 
import MenuEditForm from "@/components/MenuEditForm"; 

interface EditMenuPageProps {
  params: {
    id_kantin: string;
    id_menu: string;
  };
}

export default async function AdminEditMenuPage({ params }: EditMenuPageProps) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    redirect("/login"); 
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">[ADMIN] Edit Menu: {menu.nama_menu}</h1>
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
  );
}
