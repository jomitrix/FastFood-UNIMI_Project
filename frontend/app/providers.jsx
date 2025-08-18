"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

export function Providers({ children }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <HeroUIProvider navigate={router.push}>
        <CartProvider>
          <ToastProvider />
          {children}
        </CartProvider>
      </HeroUIProvider>
    </AuthProvider>
  );
}