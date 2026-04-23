"use client";

import { useState } from "react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { logoutUser } from "../../utils/token";

const sidebarItems = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg
        aria-label="Home"
        color={active ? "#0095f6" : "#262626"}
        fill={active ? "#0095f6" : "none"}
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7v-5.455z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (active: boolean) => (
      <svg
        aria-label="Search"
        color={active ? "#0095f6" : "#262626"}
        fill="none"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="16.511"
          x2="22"
          y1="16.511"
          y2="22"
        ></line>
      </svg>
    ),
  },
  {
    label: "Reels",
    href: "/reels",
    icon: (active: boolean) => (
      <img
        src="/video.svg"
        className={`w-6 h-6 transition-all duration-300 ${active ? "brightness-0 invert-[.5] sepia(1) saturate(5) hue-rotate(190deg)" : "brightness-0"}`}
        alt="Reels"
        style={
          active
            ? {
                filter:
                  "invert(48%) sepia(82%) saturate(2423%) hue-rotate(185deg) brightness(101%) contrast(101%)",
              }
            : {}
        }
      />
    ),
  },
  {
    label: "Messages",
    href: "/messages",
    icon: (active: boolean) => (
      <img
        src="/message.svg"
        className="w-6 h-6 transition-all duration-300"
        alt="Messages"
        style={
          active
            ? {
                filter:
                  "invert(48%) sepia(82%) saturate(2423%) hue-rotate(185deg) brightness(101%) contrast(101%)",
              }
            : { filter: "brightness(0)" }
        }
      />
    ),
  },
  {
    label: "Notifications",
    href: "/notification",
    icon: (active: boolean) => (
      <svg
        aria-label="Notifications"
        color={active ? "#0095f6" : "#262626"}
        fill={active ? "#0095f6" : "none"}
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
      </svg>
    ),
  },
  {
    label: "Create",
    href: "/createPost",
    icon: (active: boolean) => (
      <svg
        aria-label="New Post"
        color={active ? "#0095f6" : "#262626"}
        fill="none"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <rect
          fill="none"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          width="18"
          x="3"
          y="3"
        ></rect>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="12"
          x2="12"
          y1="8"
          y2="16"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="8"
          x2="16"
          y1="12"
          y2="12"
        ></line>
      </svg>
    ),
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
              <span
                className={`text-base tracking-wide ${isActive ? "font-bold" : "font-normal text-[#262626]"}`}
              >
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
          <div
            className={`w-6 h-6 rounded-full overflow-hidden border transition-all group-hover:scale-110 
            ${pathname === "/profile" ? "border-[#0095f6]" : "border-gray-300"}`}
          >
            <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <span
            className={`text-base tracking-wide ${pathname === "/profile" ? "font-bold" : "font-normal"}`}
          >
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
                <span className="text-[red]">Log out</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex items-center gap-4 p-3 w-full rounded-lg hover:bg-[#fafafa] transition-all text-[#262626] group ${isMoreOpen ? "bg-[#fafafa]" : ""}`}
        >
          <svg
            aria-label="Settings"
            color="#262626"
            fill="none"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
            className="group-hover:scale-110 transition-transform"
          >
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isMoreOpen ? 3 : 2}
              x1="3"
              x2="21"
              y1="4"
              y2="4"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isMoreOpen ? 3 : 2}
              x1="3"
              x2="21"
              y1="12"
              y2="12"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isMoreOpen ? 3 : 2}
              x1="3"
              x2="21"
              y1="20"
              y2="20"
            ></line>
          </svg>
          <span
            className={`text-base ${isMoreOpen ? "font-bold" : "font-normal"}`}
          >
            More
          </span>
        </button>
      </div>
    </aside>
  );
}
