"use client";

import "@/styles/globals.css";
import SimpleNavbar from "@/components/app/SimpleNavbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SimpleNavbar/>

      <main>{children}</main>
    </div>
  );
}
