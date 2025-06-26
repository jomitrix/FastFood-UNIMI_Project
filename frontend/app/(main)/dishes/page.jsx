'use client';
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";

export default function DishesPage() {
  const router = useRouter();

  // dati mock
  const mockUser = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "MarioRossi",
    accountType: "user"
  };

  const mockRestaurant = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "La Pizzeria di Mario",
    accountType: "restaurant"
  };

  const mock = mockRestaurant;

  useEffect(() => {
    // Controllo se l'utente è autenticato
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (/*!*/token) {
      router.push("/auth/login");
    }
  }, [router]);

  if (mock.accountType !== "restaurant") {
    notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f6f6f6]">
      <AccountHeader
        accountType={mock.accountType}
        title="Dishes Management"
        subtitle="Manage your restaurant's dishes"
      />

      <div className="mt-[15rem] w-full flex text-5xl font-extrabold justify-center items-center">
        🚧 Work In Progress
      </div>    
    </div>
  );
}
