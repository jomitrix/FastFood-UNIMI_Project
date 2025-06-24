'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Temporary Redirect
  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return (
     <div className=" w-full">
        <div className="flex items-center justify-center min-h-screen">
          
        </div>
    </div>
  );
}
