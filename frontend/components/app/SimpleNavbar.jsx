"use client";
import Link from 'next/link';
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Home } from "@/components/icons/heroicons";

export default function NotFoundPage() {
  return (
    <Navbar
        className="w-full flex bg-[#ff8844]"
        maxWidth="full"
    >
        <NavbarBrand className="gap-2">
            <Link href="/">
                <img src="/images/logo.png" alt="🍔 Fast Food" className="w-32" />
            </Link>
        </NavbarBrand>

        <NavbarContent justify="end" className="flex">
            <Button as={Link} color="primary" href="/" className="bg-black font-semibold rounded-full">
                <Home className="w-5 h-5 mr-1" />
                Back to Home
            </Button>
        </NavbarContent>
      </Navbar>
  );
}
