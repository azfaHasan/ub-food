import Link from "next/link";

const Button = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="bg-[#3B81F4] rounded-md text-sm flex items-center justify-center py-3">
    {children}
  </Link>
);

export default function LoginSelection() {
  return (
    <div className="mx-auto rounded-xl my-14 px-16 flex items-center flex-col bg-[#A5C5FA] py-20 w-1/3">
      <h1 className="text-5xl font-bold mb-8 ">UB Food</h1>
      <div className="grid grid-cols-1 w-full  gap-6">
        <Button href="/login/user">Login Sebagai User</Button>
        <Button href="/login/penjual">Login Sebagai Penjual</Button>
        <Button href="/login/admin">Login Sebagai Admin</Button>
      </div>
      <Link className="text-white font-bold text-sm mt-4 w-full" href="/register">Belum ada akun ?</Link>
    </div>
  );
}
