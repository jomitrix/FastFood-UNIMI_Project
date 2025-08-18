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
        } else if (!user?.restaurant) {
            console.log("User is a restaurant but has no restaurant data.");
            router.replace("/onboarding/restaurant");
        }
    }, [user, router]);

    return (
        <main>
            {children}
        </main>
    );
}

export default withAuth(ResturantLayout);