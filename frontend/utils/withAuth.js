// utils/withAuth.js
'use client';                     // se stai nell’App Router
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // o 'next/router' se pages/
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@heroui/spinner';

export function withAuth(PageComponent) {
    return function AuthenticatedPage(props) {
        const { checkAuthStatus } = useAuth();
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let mounted = true;

            (async () => {
                const ok = await checkAuthStatus();   // deve restituire true/false
                if (!mounted) return;

                if (!ok) {
                    router.replace('/auth/login');
                } else {
                    setLoading(false);
                }
            })();

            return () => { mounted = false; };
        }, [checkAuthStatus, router]);

        // finché non so che va tutto bene, non renderizzo nulla
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <Spinner size="lg" color='white' />
                </div>
            );
        }

        // authenticated → mostro la pagina
        return <PageComponent {...props} />;
    };
}
