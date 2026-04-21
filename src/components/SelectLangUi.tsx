"use client";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "../i18n/navigation";
import { useLocale } from "next-intl";

const SelectLanguage = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChangeLanguage = (event: any) => {
    router.push(pathname, { locale: event.target.value });
  };

  return (
    <div className="mt-4 px-3">
      <select
        value={locale}
        onChange={handleChangeLanguage}
        className="w-full bg-transparent border-none text-xs text-gray-500 cursor-pointer focus:ring-0 outline-none hover:text-gray-800 transition-colors"
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="tj">Tojikī</option>
      </select>
    </div>
  );
};

export default SelectLanguage;
