import { hasLocale, NextIntlClientProvider } from "next-intl";
import "../../globals.css";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Providers from "@/src/components/ProvidersUi";
import Sidebar from "@/src/components/SidebarUi";

import MobileNav from "@/src/components/MobileNav";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Check if user is logged in to decide whether to show the sidebar
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_token");

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="antialiased bg-white overflow-x-hidden">
        <Providers>
          <NextIntlClientProvider locale={locale}>
            <div className="flex min-h-screen">
              {/* Sidebar: Only visible if logged in */}
              {isLoggedIn && (
                <div className="hidden lg:block">
                  <Sidebar />
                </div>
              )}

              {/* Main Content Area: Margin only if sidebar is present */}
              <main className={`flex-1 transition-all duration-300 ${isLoggedIn ? "lg:ml-[245px]" : ""}`}>
                <div className={isLoggedIn ? "max-w-[975px] mx-auto pt-8 px-4 sm:px-8" : "w-full min-h-screen"}>
                  {children}
                </div>
              </main>

              {/* Mobile Bottom Nav: Only show if logged in */}
              {isLoggedIn && <MobileNav />}
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
