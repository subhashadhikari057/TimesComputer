// components/blog/blogCard.tsx

import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Button } from "../ui/button";

interface BlogCardProps {
  image: string;
  title: string;
  description: string;
  id: string;
}

export default function BlogCard({ image, title, description, id }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden h-[350px] w-[300px] relative">
      <Image
        width={300}
        height={130}
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-md line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        <Button
          variant="ghost"
          asChild
          className="absolute bottom-1.5 left-3 mt-6 text-secondary text-md font-semibold rounded-lg transition"
        >
          <Link href={`/blogs/${id}`}>
            Read more <IoArrowForwardOutline className="w-3 h-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
