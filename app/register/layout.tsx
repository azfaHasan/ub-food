import { ReactNode } from 'react';
import bg from "@/assets/auth/bg-register.png"
interface RegisterLayoutProps {
    children: ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
    return (
        <div className="min-h-screen flex" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {children}
        </div>
    );
}