import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { Lexend_Deca } from "next/font/google";
import localFont from "next/font/local";

const headingFont = localFont({ src: "../public/fonts/font.woff2" });

const Logo = () => {
  return (
    <Link href="/" className="">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.png" width={30} height={30} alt="Logo" />
        <p
          className={cn(
            "text-lg text-neutral-700 self-end",
            headingFont.className
          )}
        >
          TaskAnother
        </p>
      </div>
    </Link>
  );
};

export default Logo;
