import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import { fontSans, fontMono } from "@/config/fonts";
import { Providers } from "./providers";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${fontSans.className} bg-[#f5f3f5]`}>
      <head />
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
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