import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CompareProvider } from "@/contexts/CompareContext";

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
        <CompareProvider>
          <Toaster duration={2000} position="top-center" richColors/>
          {children}
        </CompareProvider>
      </body>
    </html>
  );
}
