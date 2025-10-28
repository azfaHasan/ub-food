import { ReactNode } from 'react';
import bg from "@/assets/auth/bg-register.png"
interface LoginLayoutProps {
    children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
    return (
        <div className="min-h-screen flex" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {children}
        </div>
    );
}