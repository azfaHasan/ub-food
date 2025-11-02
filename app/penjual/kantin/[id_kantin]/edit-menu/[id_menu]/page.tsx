import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateMenu, type FormState } from "@/lib/actions/menu.actions"; 
import MenuEditForm from "@/components/MenuEditForm"; 
import { type Session } from "next-auth";

interface EditMenuPageProps {
  params: {
    id_kantin: string;
    id_menu: string;
  };
}

async function canModifyMenu(kantinId: string, session: Session | null) {
  if (!session) return false;

  if (session.user.role === Role.ADMIN) return true;

  if (session.penjual?.id) {
    const kantin = await prisma.kantin.findFirst({
      where: { id_kantin: kantinId, id_penjual: session.penjual.id },
    });
    return !!kantin;
  }
  return false;
}

export default async function EditMenuPage({ params }: EditMenuPageProps) {
  
  const session = await auth();
  const hasAccess = await canModifyMenu(params.id_kantin, session);
  
  if (!hasAccess) {
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
      <h1 className="text-2xl font-bold mb-6">Edit Menu: {menu.nama_menu}</h1>
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
