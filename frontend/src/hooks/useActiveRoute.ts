"use client";

import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  const isRouteActive = (route: string) => pathname === route;

  const isParentActive = (parentRoutes: string[]) =>
    parentRoutes.some((route) => pathname.startsWith(route));

  return {
    activeRoute: pathname,
    isRouteActive,
    isParentActive,
  };
}
