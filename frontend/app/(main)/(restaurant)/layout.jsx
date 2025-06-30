"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
    const router = useRouter();
    const { user } = useAuth();
        
    useEffect(() => {
        if (user !== null && user?.role !== "restaurant") {
            router.push("/");
        }
    }, [user]);

    return (
        user?.role === "restaurant" && (
            <main>
                {children}
            </main>
        )
    );
}
