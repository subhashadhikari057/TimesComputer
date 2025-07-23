// components/breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null; // no breadcrumbs, no space
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = decodeURIComponent(segment.replace(/-/g, ' '));
    return { label, href };
  });

  return (
    <div className="mt-6"> {/* Add margin only when breadcrumbs exist */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
          </BreadcrumbItem>

          {breadcrumbs.map((crumb) => {
  const isCategory = crumb.label.toLowerCase() === 'category';
  const isBrand = crumb.label.toLowerCase() === 'brand';

  return (
    <span key={crumb.href} className="flex items-center">
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Link
          href={isCategory ? '/#category' : isBrand? '/#brand' : crumb.href}
          scroll={isCategory || isBrand} // enable scroll behavior only for hash
          className="  islast? text-primary font-medium transition : text-muted-foreground hover:text-foreground capitalize transition"
        >
          {crumb.label}
        </Link>
      </BreadcrumbItem>
    </span>
  );
})}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
