"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
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
import { useAuth } from '@/contexts/AuthContext';


export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, checkAuthStatus, logout } = useAuth();
  const [isLogged, setIsLogged] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [isManHambMenuOpen, setIsManHambMenuOpen] = useState(false);

  useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

  useEffect(() => {
    if (user || isAuthenticated) {
      setIsLogged(true);
      setAccountType(user?.role || null);
    } else {
      setIsLogged(false);
      setAccountType(null);
    }

    console.log(isLogged + "    " + accountType)
  }, [user, isAuthenticated]);

  const handleToggleManager = () => {
    // hamburger menu
    setIsManHambMenuOpen(!isManHambMenuOpen);
  };

  const managerContextValue = {
    isManHambMenuOpen,
    handleToggleManager,
    setIsManHambMenuOpen
  }

  const handleLogout = async () => {
    await logout();
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
            <Link className="flex flex-shrink-0" href="/">
              <img src="/images/logo.png" alt="🍔 Fast Food" className="w-32" />
            </Link>
          </NavbarBrand>

          {/* Pulsanti login/account */}
          <NavbarContent justify="end" className="flex">
            <NavbarItem>
              { isLogged !== null && (
                !isLogged ? (
                  <Button as={Link} color="primary" href="/auth/login" className="bg-black font-semibold rounded-full">
                    <Login className="w-5 h-5 mr-1" />
                    Login
                  </Button>
                ) : (
                  accountType ? (
                    !(pathname.startsWith("/account") || pathname.startsWith("/manager")) ? (
                      <Button as={Link} color="primary" href={accountType === "user" ? "/account" : "/manager/dashboard"} className="bg-black font-semibold rounded-full">
                        {accountType === "user" ? (
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
                  ) : null
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