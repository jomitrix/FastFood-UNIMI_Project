"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
        
    useEffect(() => {
        if (user !== null && user?.role !== "user") {
        router.push(`/manager${pathname}`);
        }
    }, [user]);

    return (
        user?.role === "user" && (
            <main>
                {children}
            </main>
        )
    );
}