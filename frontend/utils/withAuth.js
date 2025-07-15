'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
                const ok = await checkAuthStatus();
                if (!mounted) return;

                if (!ok) {
                    router.replace('/auth/login');
                } else {
                    setLoading(false);
                }
            })();

            return () => { mounted = false; };
        }, [checkAuthStatus, router]);

        if (loading) {
            return (
                <div className="flex items-center justify-center bg-[#f5f3f5] min-h-screen">
                    <Spinner className='w-100 h-100' variant="dots" classNames={{
                        dots: 'bg-[#083d77]',
                    }} />
                </div>
            );
        }

        return <PageComponent {...props} />;
    };
}
