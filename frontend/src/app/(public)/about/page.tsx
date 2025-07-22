"use client";

import React from "react";
import Image from "next/image";
import BrandCarousel from "@/components/home/BrandScroller";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/blogimg/bloghero.png"
          alt="About us background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl font-bold">About us</h1>
          <p className="mt-2 text-lg sm:text-xl font-medium">
            Nepal&apos;s rising tech destination
          </p>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="px-4 sm:px-8 lg:px-16 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="w-full">
            <Image
              src="/aboutimg/about.png"
              alt="Time Office Automation shop"
              width={800}
              height={500}
              className="rounded shadow-md"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Who are We</h2>
            <div className="h-1 w-20 bg-secondary mb-4" />
            <p className="text-gray-700 text-base leading-relaxed">
              At Times Computer Automation, we&apos;re more than just a laptop store.
              We focus on providing the latest, high-performance laptops for work,
              study, or play – all at prices that suit your budget. Whether
              you&apos;re in Kathmandu or Kanchanpur, our goal is to put the perfect
              laptop in your hands with fast, reliable delivery nationwide.
              Explore our growing collection and upgrade your tech game today!
            </p>
          </div>
        </div>

        {/* Why Us + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Why Us */}
          <div className="pr-4 lg:pr-16">
            <h2 className="text-2xl font-bold mb-4">Why us?</h2>
            <div className="h-1 w-20 bg-secondary mb-4" />
            <p className="text-gray-700 text-base leading-relaxed text-justify">
              At <span className="font-medium text-primary">Times Computer Automation</span>,
              we offer what others don&apos;t: bulk laptop purchases at unbeatable retail prices.
              Whether you&apos;re buying one or one hundred, you get the same great value.
              Perfect for offices, schools, or resellers, with fast nationwide delivery you can count on.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 border-border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-primary">700+</h3>
              <p className="font-medium mt-2">Products available</p>
              <p className="text-sm text-gray-500 mt-1">
                With over 700+ laptops and accessories to choose from.
              </p>
            </div>
            <div className="p-6 border-border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-primary">50+</h3>
              <p className="font-medium mt-2">Tech Brands</p>
              <p className="text-sm text-gray-500 mt-1">
                Supporting all major laptop and accessory brands.
              </p>
            </div>
            <div className="p-6 border-border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-primary">1500+</h3>
              <p className="font-medium mt-2">Happy Customers</p>
              <p className="text-sm text-gray-500 mt-1">
                Trusted by over 1500 customers across Nepal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Carousel */}
      <div className="text-center">
        <BrandCarousel title="Brands We Offer" titleClassName="section-title" />
      </div>

      {/* Visit Us */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 space-y-4 text-center">
        <h1 className="section-title">Visit Us</h1>
        <div className="mt-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.447849544003!2d85.3226347!3d27.7034555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a842976dcd%3A0x16f9af684b2eaa9c!2sTime%20Office%20Automation%20PVT%20LTD!5e0!3m2!1sen!2snp!4v1752471076407!5m2!1sen!2snp"
            width="100%"
            height="355"
            className="rounded-xl"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
