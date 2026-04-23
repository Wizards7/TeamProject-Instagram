"use client";

import React from "react";
import { Link, usePathname } from "@/src/i18n/navigation";

const navItems = [
  {
    href: "/",
    icon: (active: boolean) => (
      <svg aria-label="Home" color="black" fill={active ? "black" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7v-5.455z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    href: "/search",
    icon: (active: boolean) => (
      <svg aria-label="Search" color="black" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? "3" : "2"}></path>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? "3" : "2"} x1="16.511" x2="22" y1="16.511" y2="22"></line>
      </svg>
    )
  },
  {
    href: "/reels",
    icon: (active: boolean) => (
       <img 
        src="/video.svg" 
        className={`w-6 h-6 ${active ? "brightness-100" : "brightness-0"}`} 
        alt="Reels" 
      />
    )
  },
  {
    href: "/createPost",
    icon: (active: boolean) => (
      <svg aria-label="New Post" color="black" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <rect fill="none" height="18" rx="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="8" y2="16"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8" x2="16" y1="12" y2="12"></line>
      </svg>
    )
  },
  {
    href: "/profile",
    icon: (active: boolean) => (
      <div className={`w-6 h-6 rounded-full overflow-hidden border ${active ? "border-black" : "border-transparent"}`}>
        <img src="/image.webp" className="w-full h-full object-cover" alt="profile" />
      </div>
    )
  }
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[50px] bg-white border-t border-gray-200 z-[100] flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex justify-center py-2">
            {item.icon(isActive)}
          </Link>
        );
      })}
    </div>
  );
}
