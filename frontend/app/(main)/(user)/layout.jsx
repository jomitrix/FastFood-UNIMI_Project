"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from "@/utils/withAuth";


function UserLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== "user") {
            router.replace(`/manager${pathname}`);
        }
    }, [user, pathname, router]);

    return (
        <main>
            {children}
        </main>
    );
}

export default withAuth(UserLayout);
