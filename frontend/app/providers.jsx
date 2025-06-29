"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { AuthProvider } from '../contexts/AuthContext';

export function Providers({ children }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </AuthProvider>
  );
}