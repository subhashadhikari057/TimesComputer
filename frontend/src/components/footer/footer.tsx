"use client";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: FC = () => {
    const year=new Date().getFullYear();
  return (
    <footer className="bg-muted-background w-full max-h-[49.63vh] py-10 text-muted-foreground2 font-medium">
      <div className="max-w-7xl mx-auto">
      <div className=" mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div className="flex flex-col items-start">
          <Image
            src="/logos/logo.png"
            width={124}
            height={118}
            alt="Logo"
            className="mb-4"
          />
          <p className="text-sm">
            Built on a simple idea, buying a laptop shouldn&apos;t be
            complicated.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <Link href="">
              <FaInstagram size={28} className="text-primary" />
            </Link>
            <Link href="">
              <FaFacebook size={28} className="text-primary" />
            </Link>

            <Link href="">
              <FaTwitter size={28} className="text-primary " />
            </Link>
          </div>
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="font-semibold relative text-primary text-lg inline-block mb-2">
            Top Category
            <div className="absoulte left-0 bottom-0 h-[2px] w-[50%] bg-primary"></div>
          </h3>
          <ul className="space-y-1 text-sm mt-2">
            <li>Mac</li>
            <li>Gaming Laptops</li>
            <li>Business Laptops</li>
            <li>Student Laptops</li>
            <li>Everyday Laptops</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>

           
          <h3 className="font-semibold relative text-lg  text-primary inline-block mb-2">
            Quick Links
            <div className="absolute left-0 bottom-0 h-[2px] w-[50%] bg-primary"/>
          </h3>
          <ul className="space-y-1 text-sm mt-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                More
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg relative text-primary inline-block mb-2">
            Contact
                        <div className="absolute left-0 bottom-0 h-[2px] w-[50%] bg-primary"/>

          </h3>
          <ul className="text-sm mt-2 space-y-2">
            <li className="flex items-center gap-2">
              <FaPhone /> 9808119904
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> admin@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> Kathmandu, Nepal
            </li>
          </ul>
          <div className="mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.447849544003!2d85.3226347!3d27.7034555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a842976dcd%3A0x16f9af684b2eaa9c!2sTime%20Office%20Automation%20PVT%20LTD!5e0!3m2!1sen!2snp!4v1752471076407!5m2!1sen!2snp"
              width={236}
              height={108}
              className="rounded-2xl"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 px-4 footer flex flex-col md:flex-row justify-between mx-auto items-center pt-4 text-center text-sm text-muted-foreground">
        
        <div>
            <p>&copy;{year} Times Computer Automation. <span className="whitespace-nowrap">All Rights Reserved.</span></p>
            </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:underline underline-offset-3">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline underline-offset-3">
            Terms of service
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
