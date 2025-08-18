'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/manager/dashboard");
  }, []);

  return (
    <div className='w-full bg-[#f5f3f5] h-screen'>

    </div>    
  );
}