import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    // Handle exact match
    if (pathname === route) return true;
    if (pathname.startsWith(route + "/")) return true;

    // Handle query parameters
    if (pathname.startsWith(route + "?")) return true;

    return false;
  };

  const isParentActive = (parentRoutes: string[]) =>
    parentRoutes.some((route) => pathname.startsWith(route));

  return {
    activeRoute: pathname,
    isRouteActive,
    isParentActive,
  };
}
