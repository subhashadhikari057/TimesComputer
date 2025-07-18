import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { IoArrowForwardOutline } from "react-icons/io5";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src='/blogimg/bloghero.png'
        alt="Hero Background"
        height={960}
       width={1920}
        
        className="object-cover object-center z-0"
        priority
      />

      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Foreground Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 md:px-20 text-white">
        <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-md mb-4">
          Featured
        </span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Best Laptops for Students,<br /> 
          Professionals & Gamers in 2025
        </h1>
        <p className="text-sm md:text-lg mt-4 max-w-xl">
          Looking for the right laptop in 2025? Whether you&apos;re a student attending classes, 
          a professional managing workloads, or a gamer...
        </p>
        <Button asChild className="mt-6 text-white bg-secondary hover:bg-secondary/90 text-sm font-semibold rounded-lg shadow-2xl transition">
         <Link href="#">Read more <IoArrowForwardOutline className="w-3 h-3 ml-1"  /></Link> 
        </Button>
      </div>

      
    </section>
  )
}
