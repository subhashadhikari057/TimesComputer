// app/components/home/Adbanner.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner } from "../../../../types/banner";
import AdPlaceholder from "../AdPlaceholder";

interface AdbannerProps {
  banner: Banner;
}

export default function Adbanner({ banner }: AdbannerProps) {
  // If no valid image URL, show placeholder
  if (!banner.imageUrl || banner.imageUrl.trim() === "") {
    return <AdPlaceholder placement="box" />;
  }

  return (
    // ✅ Full clickable container that fully fills grid cell
    <div className="relative w-full h-full">
      <Link href={banner.link} className="block w-full h-full">
        <Image
          src={banner.imageUrl}
          alt={banner.alt || "banner"}
          fill // ✅ Makes image fill the parent div
          className="object-cover" // ✅ Ensures image covers and crops well
          unoptimized
        />
      </Link>
    </div>
  );
}
