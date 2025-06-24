"use client";
import "@/styles/globals.css";

import { Providers } from "../providers";
import { fontSans } from "@/config/fonts";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="w-full bg-warning">
      <NavbarBrand>
        🍔
        <p className="font-bold text-inherit">Fast Food</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
      <main>
        {children}
      </main>
    </div>
  );
}