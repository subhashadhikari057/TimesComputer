'use client';

import { usePathname } from 'next/navigation';
import Footer from "@/components/footer/footer";
import Navbar from "@/components/home/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideBreadcrumbRoutes = ['/blogs','/about']; 
  const shouldHideBreadcrumbs = hideBreadcrumbRoutes.includes(pathname);

  return (
    <>
      <Navbar />
      {!shouldHideBreadcrumbs && (
        <header className="w-full flex justify-center">
          <div className="max-w-7xl w-full px-4">
            <Breadcrumbs />
          </div>
        </header>
      )}
      {children}
      <Footer />
    </>
  );
}
