import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// Load Google Font with CSS variable
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
      className="scroll-smooth overflow-x-hidden" // ✅ prevent mobile overflow
      suppressHydrationWarning
    >
      <body
        className={`${manrope.variable} font-sans antialiased bg-white text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
