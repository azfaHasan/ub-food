import Link from "next/link";

const Button = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} style={{ display: 'block', padding: '10px', margin: '10px', background: 'blue', color: 'white', textAlign: 'center' }}>
    {children}
  </Link>
);

export default function LoginSelection() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#light-blue', padding: '20px' }}>
      <h1>UB Food</h1>
      <Button href="/login/user">Login Sebagai User</Button>
      <Button href="/login/penjual">Login Sebagai Penjual</Button>
      <Button href="/login/admin">Login Sebagai Admin</Button>
      <Link href="/register">Belum ada akun ?</Link>
    </div>
  );
}
