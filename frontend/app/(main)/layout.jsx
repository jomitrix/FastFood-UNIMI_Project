"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ManagerProvider } from "@/contexts/ManagerContext";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Profile, Login, Logout, Dashboard, Hamburger } from "@/components/icons/heroicons";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();

  const pathname = usePathname();
  const [isLogged, setIsLogged] = useState(false);
  const [accountType, setAccountType] = useState("user");
  const [isManHambMenuOpen, setIsManHambMenuOpen] = useState(false);

  const handleToggleManager = () => {
    // Toggle the hamburger menu (manager)
    setIsManHambMenuOpen(!isManHambMenuOpen);
  };

  const managerContextValue = {
    isManHambMenuOpen,
    handleToggleManager,
    setIsManHambMenuOpen
  }

  const handleLogout = () => {
    // Logout to implement

    setIsLogged(false);
    router.push("/auth/login");
  }

  return (
    <div className="bg-[#ff8844]">
    <ManagerProvider value={managerContextValue}>
      <div className="flex flex-col min-h-screen">
        <Navbar
          className="flex bg-[#ff8844] fixed"
          position="sticky"
          maxWidth="full"
        >
          <NavbarBrand>
            { pathname.startsWith("/manager") && (
              <Button 
                  isIconOnly
                  variant="transparent" 
                  aria-label={isManHambMenuOpen ? "Chiudi menu" : "Apri menu"} 
                  onPress={handleToggleManager}
                  className="hidden lg:flex -ml-2 px-6 mr-6"
                >
                  <Hamburger size={32} className="flex flex-shrink-0"/>
              </Button>
            )}
            <Link className="flex flex-shrink-0" href="/home">
              <img src="/images/logo.png" alt="🍔 Fast Food" className="w-32" />
            </Link>
          </NavbarBrand>

          {/* Menu desktop */}
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive={pathname.startsWith("/account")}>
              <Link
                href="/account"
                className={`text-black ${pathname.startsWith("/account") ? "font-semibold rounded-full px-3 py-1 bg-black/5" : ""}`}
              >
                TEMP: User
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname.startsWith("/manager")}>
              <Link
                href="/manager/dashboard"
                className={`text-black ${pathname.startsWith("/manager") ? "font-semibold rounded-full px-3 py-1 bg-black/5" : ""}`}
              >
                TEMP: Restaurant
              </Link>
            </NavbarItem>
          </NavbarContent>

          {/* Pulsanti login/account */}
          <NavbarContent justify="end" className="flex">
            <NavbarItem>
              {!isLogged ? (
                <Button as={Link} color="primary" href="/auth/login" className="bg-black font-semibold rounded-full">
                  <Login className="w-5 h-5 mr-1" />
                  Login
                </Button>
              ) : (
                ! (pathname.startsWith("/account") || (pathname.startsWith("/manager")) ) ? (
                  <Button as={Link} color="primary" href={`${pathname.startsWith("/account") ? "/account" : "/manager/dashboard"}`} className="bg-black font-semibold rounded-full">
                    {accountType !== "restaurant" ? (
                      <>
                        <Profile className="w-5 h-5 mr-1" />
                        Account
                      </>
                    ) : (
                      <>
                        <Dashboard className="w-5 h-5 mr-1" />
                        Dashboard
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onPress={handleLogout} className="bg-[#083d77] text-white font-semibold rounded-full">
                    <Logout className="w-5 h-5 mr-1" />
                    Logout
                  </Button>
                )
              )}
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="mt-16">{children}</main>
      </div>
    </ManagerProvider>
    </div>
  );
}