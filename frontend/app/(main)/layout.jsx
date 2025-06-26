"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Profile, Login, Logout, Dashboard } from "@/components/icons/heroicons";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();

  const pathname = usePathname();
  const [isLogged, setIsLogged] = useState(false);
  const [accountType, setAccountType] = useState("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    // Logout to implement

    setIsLogged(false);
    router.push("/auth/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        className="w-full flex bg-[#ff8844]"
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      >
        <NavbarBrand className="gap-2">
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>
            <img src="/images/logo.png" alt="🍔 Fast Food" className="h-32" />
          </Link>
        </NavbarBrand>

        {/* Toggle visibile solo su mobile */}
        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Menu desktop */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={isActive("/restaurant")}>
            <Link
              href="/restaurant"
              className={`text-black ${isActive("/restaurant") ? "font-semibold rounded-full px-3 py-1 bg-black/5" : ""}`}
            >
              Restaurant
            </Link>
          </NavbarItem>
          <NavbarItem isActive={isActive("/account")}>
            <Link
              href="/account"
              className={`text-black ${isActive("/account") ? "font-semibold rounded-full px-3 py-1 bg-black/5" : ""}`}
            >
              TEMP: Profile
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Pulsanti login/account */}
        <NavbarContent justify="end" className="hidden sm:flex">
          <NavbarItem>
            {!isLogged ? (
              <Button as={Link} color="primary" href="/auth/login" className="bg-black font-semibold rounded-full">
                <Login className="w-5 h-5 mr-1" />
                Login
              </Button>
            ) : (
              !isActive("/account") ? (
                <Button as={Link} color="primary" href="/account" className="bg-black font-semibold rounded-full">
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
                <Button onPress={handleLogout} className="bg-[#003f5e] text-white font-semibold rounded-full">
                  <Logout className="w-5 h-5 mr-1" />
                  Logout
                </Button>
              )
            )}
          </NavbarItem>
        </NavbarContent>

        {/* Menu mobile */}
        <NavbarMenu className="bg-[#ff8844]">
          <NavbarMenuItem>
            <Link
              href="/home"
              className={`text-black ${isActive("/home") ? "font-semibold underline" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/restaurant"
              className={`text-black ${isActive("/restaurant") ? "font-semibold underline" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurant
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            {!isLogged ? (
              <Button as={Link} color="primary" href="/auth/login" className="bg-black font-semibold rounded-lg py-0 px-3">
                <Login className="w-5 h-5 mr-1" />
                Login
              </Button>
            ) : (
              !isActive("/account") ? (
                <Button as={Link} color="primary" href="/account" className="bg-black font-semibold rounded-lg py-0 px-3">
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
                <Button color="primary" onPress={handleLogout} className="bg-[#003f5e] font-semibold rounded-lg py-0 px-3">
                  <Logout className="w-5 h-5 mr-1" />
                  Logout
                </Button>
              )
            )}
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <main>{children}</main>
    </div>
  );
}
