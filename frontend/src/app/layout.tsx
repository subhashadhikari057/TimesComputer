import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CompareProvider } from "@/contexts/CompareContext";
import NextTopLoader from 'nextjs-toploader';

// Load Google Font with CSS variable
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TimesComputers",
  description: "Ecommerce Website for Laptop and Accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${manrope.variable} font-manrope antialiased bg-white text-primary`}
      >
        <NextTopLoader 
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 15px #2563eb,0 0 8px #2563eb"
        />
        <CompareProvider>
          <Toaster duration={2000} position="top-center" richColors/>
          {children}
        </CompareProvider>
      </body>
    </html>
  );
}
