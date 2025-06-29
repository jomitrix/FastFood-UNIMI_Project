'use client';
import { withAuth } from '@/utils/withAuth';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/manager/account");
  }, []);

  return;
}

export default withAuth(Home);