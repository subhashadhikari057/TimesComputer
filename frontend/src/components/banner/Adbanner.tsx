"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner } from "../../../types/banner";

interface AdbannerProps {
  banner: Banner;
}

export default function Adbanner({ banner }: AdbannerProps) {
  return (
    <Link href={banner.link} className="relative w-full h-full block">
      <Image
        src={banner.imageUrl}
        alt={banner.alt || 'banner'}
        fill
        className="object-cover"
        unoptimized
      />
    </Link>
  );
}
