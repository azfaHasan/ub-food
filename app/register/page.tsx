import Link from "next/link";

const Button = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="bg-[#3B81F4] rounded-md text-sm flex items-center justify-center py-3">
    {children}
  </Link>
);

export default function RegisterSelection() {
  return (
    <div className="flex items-center justify-center w-full ">
      <div className="bg-[#A5C5FA] w-1/3 px-18 min-h-[34rem] py-20 rounded-lg">
        <h1 className="text-5xl font-bold mb-8 text-center">UB Food</h1>
        <div className="space-y-3 mt-16">
          <Button href="/register/user">Register Sebagai User</Button>
          <Button href="/register/penjual">Register Sebagai Penjual</Button>
          <Link href="/login" className="text-xs font-bold">Sudah ada akun ?</Link>
        </div>
      </div>
    </div>
  );
}