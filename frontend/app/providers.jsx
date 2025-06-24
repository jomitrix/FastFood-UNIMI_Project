"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

export function Providers({ children }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      {children}
    </HeroUIProvider>
  );
}