"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner } from "../../../../types/banner";

interface AdbannerProps {
  banner: Banner;
}

export default function SingleAdbanner({ banner }: AdbannerProps) {
  return (
    // ✅ Full clickable container that fully fills grid cell
    <div className="relative w-full h-full">
      <Link href={banner.link} className="block w-full h-full">
        <Image
          src={banner.imageUrl}
          alt={banner.alt || "banner"}
          fill
          className="object-contain"
          unoptimized
        />
      </Link>
    </div>
  );
}
