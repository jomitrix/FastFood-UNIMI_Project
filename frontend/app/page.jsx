'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);

  return (
     <div className=" w-full">
        <div className="flex items-center justify-center min-h-screen">
          
        </div>
    </div>
  );
}
