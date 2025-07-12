// app/components/home/Adbanner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner } from "../../../types/banner";

interface AdbannerProps {
  banner: Banner;
}

export default function Adbanner({ banner }: AdbannerProps) {
  return (
    // Wraps image inside a full-size clickable link
    <Link href={banner.link} className="relative w-full h-full block">
      <Image
        src={banner.imageUrl}
        alt={banner.alt || 'banner'}
        fill
        className="object-cover" // Ensures image fills box and crops correctly
        unoptimized
      />
    </Link>
  );
}
