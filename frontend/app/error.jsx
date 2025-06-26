"use client";
import Link from 'next/link';
import { WaveClean } from "@/components/waves";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Home } from "@/components/icons/heroicons";

export default function CustomError() {
  return (
    <>
    <Navbar
        className="w-full flex bg-[#ff8844]"
      >
        <NavbarBrand className="gap-2">
          <Link href="/home">
            <img src="/images/logo.png" alt="🍔 Fast Food" className="h-32" />
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end" className="flex">
            <Button as={Link} color="primary" href="/home" className="bg-black font-semibold rounded-full">
                <Home className="w-5 h-5 mr-1" />
                Back to Home
            </Button>
        </NavbarContent>
      </Navbar>
    <div className="w-full flex flex-col min-h-screen bg-[#f6f6f6]">
      <div className="w-full bg-[#ff8844] flex items-center justify-center pb-5 md:pb-0 lg:pb-10">
        <div className="w-full flex flex-col md:flex-row items-center lg:w-3/5 p-5 lg:p-0 gap-10">
          <img src="/images/500.png" alt="Burger" className="w-[50%] md:w-1/2" />
          <div className="flex flex-col w-full -mt-7 sm:mt-0 md:w-1/2 gap-2 md:gap-3 lg:gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              500 - Something went wrong!
            </h1>
            <h3 className="text-xl md:text-3xl lg:text-4xl">
              Try again
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full">
        <WaveClean className="h-10 sm:h-20" />
      </div>
    </div>
    </>
  );
}
