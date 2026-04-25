"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "../i18n/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  User, 
  Bell, 
  Lock, 
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  LogOut
} from "lucide-react";
import LogoutModal from "./Auth/LogoutModal";
import { logoutUser } from "@/src/utils/token";

export default function SettingsUi() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "tj", name: "Tojikī" }
  ];

  const handleLanguageChange = (code: string) => {
    router.push(pathname, { locale: code });
  };

  return (
    <div className="max-w-[800px] mx-auto min-h-screen bg-background py-10 px-4 md:px-10">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>

      <div className="space-y-8">
        {/* Language Section */}
        <section>
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Globe size={20} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">{t("language")}</h2>
          </div>
          
          <div className="bg-secondary rounded-2xl overflow-hidden border border-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-muted ${
                  locale === lang.code ? "bg-background shadow-sm" : ""
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-medium ${locale === lang.code ? "text-primary" : "text-foreground"}`}>
                    {lang.name}
                  </span>
                  {locale === lang.code && (
                    <span className="text-[10px] text-[#0095f6] font-bold uppercase tracking-tighter">Current</span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  locale === lang.code ? "border-[#0095f6] bg-[#0095f6]" : "border-gray-300"
                }`}>
                  {locale === lang.code && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 px-2">{t("selectLanguage")}</p>
        </section>

        {/* Theme Section */}
        <section>
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <Monitor size={20} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">{t("appearance") || "Appearance"}</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "light", icon: Sun, label: "Light" },
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "system", icon: Monitor, label: "System" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                  theme === item.id 
                    ? "bg-background border-[#0095f6] shadow-md scale-105" 
                    : "bg-secondary border-border hover:bg-muted"
                }`}
              >
                <item.icon size={24} className={theme === item.id ? "text-[#0095f6]" : "text-gray-400"} />
                <span className={`text-xs font-medium ${theme === item.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Other Placeholder Sections */}
        <section className="opacity-50 pointer-events-none">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <User size={20} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Account</h2>
          </div>
          <div className="bg-secondary rounded-2xl border border-border divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm">Personal Information</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm">Security</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </section>

        <section className="opacity-50 pointer-events-none">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <Bell size={20} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Notifications</h2>
          </div>
          <div className="bg-secondary rounded-2xl p-4 border border-border">
            <span className="text-sm">Push Notifications</span>
          </div>
        </section>
        <section>
          <div className="flex items-center gap-3 mb-4 text-[#ed4956]">
            <LogOut size={20} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">{t("logout") || "Log out"}</h2>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-secondary rounded-2xl p-4 border border-border text-left hover:bg-muted transition-colors text-[#ed4956] font-medium"
          >
            {t("logout") || "Log out"}
          </button>
        </section>
      </div>

      <AnimatePresence>
        {showLogoutModal && (
          <LogoutModal
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
              logoutUser();
              router.push("/login");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
