"use client";
import "@/styles/globals.css";

import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={fontSans.className}>
      <head />
      <body
        className="min-h-screen bg-background text-foreground font-sans antialiased"
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}