"use client";

import { useState } from "react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { logoutUser } from "../utils/token";

const sidebarItems = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg aria-label="Home" color={active ? "#0095f6" : "#262626"} fill={active ? "#0095f6" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7v-5.455z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    label: "Search",
    href: "/search",
    icon: (active: boolean) => (
      <svg aria-label="Search" color={active ? "#0095f6" : "#262626"} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
      </svg>
    )
  },
  {
    label: "Explore",
    href: "/explore",
    icon: (active: boolean) => (
      <svg aria-label="Explore" color={active ? "#0095f6" : "#262626"} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <polygon fill="none" points="13.941 13.941 7.581 16.424 10.063 10.063 16.424 7.581 13.941 13.941" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
        <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
      </svg>
    )
  },
  {
    label: "Reels",
    href: "/reels",
    icon: (active: boolean) => (
      <svg aria-label="Reels" color={active ? "#0095f6" : "#262626"} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line>
        <path d="M2 12.001v3.449c0 2.849.698 4.03 3.107 4.03h13.785c2.41 0 3.108-1.181 3.108-4.03V7.002H2v5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <path d="M13.33 14.73l-3.303-1.584a.489.489 0 00-.702.44v3.168a.489.489 0 00.702.44l3.303-1.584a.489.489 0 000-.88z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    label: "Messages",
    href: "/messages",
    icon: (active: boolean) => (
      <svg aria-label="Messenger" color={active ? "#0095f6" : "#262626"} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M12.003 2.001a9.705 9.705 0 110 19.41 10.82 10.82 0 01-4.59-.997L2 22l1.62-.5.53-.17z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <path d="M9 13l3-3 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: (active: boolean) => (
      <svg aria-label="Notifications" color={active ? "#0095f6" : "#262626"} fill={active ? "#0095f6" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24">
        <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    label: "Create",
    href: "/create",
    icon: (active: boolean) => (
      <svg aria-label="New Post" color={active ? "#0095f6" : "#262626"} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <rect fill="none" height="18" rx="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="8" y2="16"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8" x2="16" y1="12" y2="12"></line>
      </svg>
    )
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[245px] border-r border-[#dbdbdb] py-2 px-3 flex flex-col z-50 bg-white group transition-all duration-300">
      {/* Logo */}
      <div className="pt-8 pb-10 px-3 flex items-center">
        <Link href="/">
          <img
            src="/Frame 168.png"
            alt="Instagram"
            className="w-[153px] h-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 relative group
                ${isActive ? "bg-[#f2f2f2] text-black" : "hover:bg-[#fafafa] text-[#262626]"}`}
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {item.icon(isActive)}
              </div>
              <span className={`text-base tracking-wide ${isActive ? "font-bold" : "font-normal text-[#262626]"}`}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute right-[-12px] top-1 bottom-1 w-1 bg-[#0095f6] rounded-l-full shadow-[0_0_8px_rgba(0,149,246,0.5)]" />
              )}
            </Link>
          );
        })}

        {/* Profile (Special Item) */}
        <Link
          href="/profile"
          className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 relative group
            ${pathname === "/profile" ? "text-[#0095f6]" : "hover:bg-[#fafafa] text-[#262626]"}`}
        >
          <div className={`w-6 h-6 rounded-full overflow-hidden border transition-all group-hover:scale-110 
            ${pathname === "/profile" ? "border-[#0095f6]" : "border-gray-300"}`}>
            <img src="/image.webp" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className={`text-base tracking-wide ${pathname === "/profile" ? "font-bold" : "font-normal"}`}>
            Profile
          </span>
          {pathname === "/profile" && (
            <div className="absolute right-[-12px] top-1 bottom-1 w-1 bg-[#0095f6] rounded-l-full shadow-[0_0_8px_rgba(0,149,246,0.5)]" />
          )}
        </Link>
      </nav>

      {/* More Menu & Dropup */}
      <div className="mt-auto pb-4 relative">
        {/* Dropup Menu */}
        {isMoreOpen && (
          <div className="absolute bottom-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1)] z-[100] overflow-hidden transform transition-all duration-200 min-w-[220px]">
            <div className="flex flex-col p-2">
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-sm w-full text-left">
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-sm w-full text-left">
                <span>Your activity</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-sm w-full text-left border-b border-gray-100 mb-1">
                <span>Saved</span>
              </button>
              <button
                onClick={logoutUser}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-sm w-full text-left"
              >
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex items-center gap-4 p-3 w-full rounded-lg hover:bg-[#fafafa] transition-all text-[#262626] group ${isMoreOpen ? "bg-[#fafafa]" : ""}`}
        >
          <svg aria-label="Settings" color="#262626" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" className="group-hover:scale-110 transition-transform">
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={isMoreOpen ? 3 : 2} x1="3" x2="21" y1="4" y2="4"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={isMoreOpen ? 3 : 2} x1="3" x2="21" y1="12" y2="12"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={isMoreOpen ? 3 : 2} x1="3" x2="21" y1="20" y2="20"></line>
          </svg>
          <span className={`text-base ${isMoreOpen ? "font-bold" : "font-normal"}`}>More</span>
        </button>
      </div>
    </aside>
  );
}
