"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../../utils/token";
import { useGetMyProfileQuery } from "../../api/userProfile";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

interface SidebarItem {
  label: string;
  href: string;
  icon: (active: boolean, hasUnread?: boolean) => React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg
        aria-label="Home"
        color="currentColor" className={active ? "text-[#0095f6]" : "text-[#262626] dark:text-gray-200"}
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
        color="currentColor" className={active ? "text-[#0095f6]" : "text-[#262626] dark:text-gray-200"}
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
    icon: (active: boolean, hasUnread?: boolean) => (
      <div className="relative">
        <svg
          aria-label="Notifications"
          color="currentColor" className={active ? "text-[#0095f6]" : "text-[#262626] dark:text-gray-200"}
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
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ed4956] border-2 border-white rounded-full" />
        )}
      </div>
    ),
  },
  {
    label: "Create",
    href: "/createPost",
    icon: (active: boolean) => (
      <svg
        aria-label="New Post"
        color="currentColor" className={active ? "text-[#0095f6]" : "text-[#262626] dark:text-gray-200"}
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

import CreatePostModal from "../createPost/CreatePostModal";
import LogoutModal from "../Auth/LogoutModal";
import { NotificationDrawer } from "./NotificationDrawer";

export default function Sidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;

  const expanded = isHovered || isMoreOpen;

  return (
    <>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isMoreOpen) setIsMoreOpen(false);
        }}
        className={`fixed left-0 top-0 bottom-0 border-r border-border py-2 px-3 flex flex-col z-50 bg-background transition-all duration-300 ease-in-out ${
          expanded ? "w-[245px]" : "w-[72px]"
        }`}
      >
        {/* Logo */}
        <div className="pt-8 pb-10 px-3 flex items-center overflow-hidden h-[76px]">
          <Link href="/" className="flex items-center">
            {expanded ? (
              <img
                src="/Frame 168.png"
                alt="Instagram"
                className="w-[153px] h-auto object-contain transition-opacity duration-200"
              />
            ) : (
              <svg
                aria-label="Instagram"
                color="currentColor"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
                className="text-foreground"
              >
                <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.042-.379 3.408 3.408 0 0 1-1.265-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z" />
              </svg>
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.label === "Create") {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 relative group/item
                    ${isActive ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"}`}
                >
                  <div className="shrink-0 transition-transform duration-200 group-hover/item:scale-110">
                    {item.icon(isActive)}
                  </div>
                  <span
                    className={`text-base tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                    } ${isActive ? "font-bold" : "font-normal"}`}
                  >
                    {t(item.label.toLowerCase())}
                  </span>
                </button>
              );
            }

            if (item.label === "Notifications") {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 relative group/item
                    ${isNotificationOpen ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"}`}
                >
                  <div className="shrink-0 transition-transform duration-200 group-hover/item:scale-110">
                    {item.icon(isNotificationOpen)}
                  </div>
                  <span
                    className={`text-base tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                    } ${isNotificationOpen ? "font-bold" : "font-normal"}`}
                  >
                    {t("notifications")}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 relative group/item
                  ${isActive ? "bg-muted text-foreground" : "hover:bg-muted text-foreground"}`}
              >
                <div className="shrink-0 transition-transform duration-200 group-hover/item:scale-110">
                  {item.icon(isActive)}
                </div>
                <span
                  className={`text-base tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
                  } ${isActive ? "font-bold" : "font-normal"}`}
                >
                  {t(item.label.toLowerCase())}
                </span>

                {isActive && (
                  <div className="absolute right-[-12px] top-1 bottom-1 w-1 bg-[#0095f6] rounded-l-full shadow-[0_0_8px_rgba(0,149,246,0.5)]" />
                )}
              </Link>
            );
          })}

          {/* Profile Link */}
          <Link
            href="/profile"
            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 relative group/item
              ${pathname === "/profile" ? "text-[#0095f6]" : "hover:bg-muted text-foreground"}`}
          >
            <div
              className={`w-6 h-6 shrink-0 rounded-full overflow-hidden border transition-all group-hover/item:scale-110 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a]
              ${pathname === "/profile" ? "border-[#0095f6]" : "border-gray-300 dark:border-gray-700"}`}
            >
              {profile?.image ? (
                <img
                  src={`${FILE_URL}${profile.image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-gray-500 uppercase">
                  {profile?.userName?.[0] || "P"}
                </span>
              )}
            </div>
            <span
              className={`text-base tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
              } ${pathname === "/profile" ? "font-bold" : "font-normal"}`}
            >
              {t("profile")}
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
            <div className="absolute bottom-[70px] left-0 w-full bg-background border border-border rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1)] z-[100] overflow-hidden transform transition-all duration-200 min-w-[220px]">
              <div className="flex flex-col p-2">
                <Link
                  href="/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-sm w-full text-left text-foreground"
                >
                  <span>{t("settings")}</span>
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-sm w-full text-left border-b border-border mb-1 text-foreground"
                >
                  <span>{t("saved")}</span>
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex items-center gap-4 p-3 w-full rounded-lg hover:bg-muted transition-all text-foreground group/item ${isMoreOpen ? "bg-muted" : ""}`}
          >
            <svg
              aria-label="Settings"
              color="currentColor"
              fill="none"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
              className="shrink-0 group-hover/item:scale-110 transition-transform"
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
              className={`text-base whitespace-nowrap overflow-hidden transition-all duration-300 ${
                expanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
              } ${isMoreOpen ? "font-bold" : "font-normal"}`}
            >
              {t("more")}
            </span>
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </AnimatePresence>

      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}

      <NotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}
