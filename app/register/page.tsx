import Link from "next/link";

const Button = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} style={{ display: 'block', padding: '10px', margin: '10px', background: 'blue', color: 'white', textAlign: 'center' }}>
    {children}
  </Link>
);

export default function RegisterSelection() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#light-blue', padding: '20px' }}>
      <h1>UB Food</h1>
      <Button href="/register/user">Register Sebagai User</Button>
      <Button href="/register/penjual">Register Sebagai Penjual</Button>
      <Link href="/register">Sudah ada akun ?</Link>
    </div>
  );
}