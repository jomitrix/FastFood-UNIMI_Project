"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from "@/utils/withAuth";

function ResturantLayout({ children }) {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== "restaurant") {
            router.replace("/");
        }
    }, [user, router]);

    return (
        <main>
            {children}
        </main>
    );
}

export default withAuth(ResturantLayout);