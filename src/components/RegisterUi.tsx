"use client";

import React, { useState } from "react";
import { Link, useRouter } from "../i18n/navigation";
import { useRegisterMutation } from "../api/Authenticator";
import { useForm } from "react-hook-form";
import { saveToken } from "../utils/token";
import { IRegisterRequest } from "../types/interface";
import LoadingUi from "./LoadingUi";
import SelectLanguage from "./SelectLangUi";
import { useTranslations } from "next-intl";

const RegisterUi = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = useForm<IRegisterRequest>({
    mode: "onChange",
  });

  const onSubmit = async (value: IRegisterRequest) => {
    try {
      const response = await registerUser(value).unwrap();
      
      if (response && response.data) {
        saveToken(response.data);
      }

      // Show Splash Screen (Sileo) for premium transition
      setShowSplash(true);
      setTimeout(() => {
        router.push("/"); // After register, go straight to HOME
      }, 1500);
    } catch (error) {
      console.error("Error In Register Ui:", error);
    }
  };

  if (showSplash) {
    return <LoadingUi />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="flex flex-col gap-3 w-full max-w-[350px]">
        <div className="bg-white border border-gray-300 px-10 py-10 flex flex-col items-center">
          <div className="mb-4">
            <h1
              className="text-[42px] tracking-tight text-[#262626] leading-none"
              style={{ fontFamily: "var(--font-instagram)" }}
            >
              Instagram
            </h1>
          </div>

          <h2 className="text-[#737373] text-[17px] font-semibold text-center leading-5 mb-6">
            {t("signupPrompt")}
          </h2>

          <button className="w-full bg-[#0095f6] hover:bg-[#1877f2] transition-colors text-white py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mb-6">
            {t("loginFacebook")}
          </button>

          <div className="w-full flex items-center gap-4 mb-4">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="text-[13px] font-bold text-gray-500 text-center">
              {t("or")}
            </span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
          </div>

          <form
            className="w-full flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1 w-full">
              <input
                {...register("email", { required: true })}
                type="text"
                placeholder={t("phoneEmail")}
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              {errors.email && (
                <span className="text-[10px] text-red-500 pl-1">
                  Required
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                {...register("fullName", { required: true })}
                type="text"
                placeholder={t("fullName")}
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              {errors.fullName && (
                <span className="text-[10px] text-red-500 pl-1">
                  Required
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                {...register("userName", {
                  required: true,
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
                type="text"
                placeholder={t("username")}
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              {errors.userName && (
                <span className="text-[10px] text-red-500 pl-1">
                  {errors.userName.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                {...register("password", {
                  required: true,
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                type="password"
                placeholder={t("password")}
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              {errors.password && (
                <span className="text-[10px] text-red-500 pl-1">
                  {errors.password.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <input
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                type="password"
                placeholder={t("confirmPassword")}
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              {errors.confirmPassword && (
                <span className="text-[10px] text-red-500 pl-1">
                  {errors.confirmPassword.message as string}
                </span>
              )}
            </div>

            <p className="text-[12px] text-[#737373] text-center mt-4 mb-4 px-1 leading-4">
              By signing up, you agree to our Terms, Privacy Policy and Cookies
              Policy.
            </p>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-1.5 rounded-lg text-sm font-bold transition-all ${
                isValid && !isLoading
                  ? "bg-[#0095f6] text-white"
                  : "bg-[#b2dffc] text-white cursor-default"
              }`}
            >
              {isLoading ? "Signing up..." : t("signup")}
            </button>

            {error && (
              <p className="text-red-500 text-[10px] mt-2 text-center font-semibold">
                Registration failed. Please try again.
              </p>
            )}
          </form>
        </div>

        <div className="bg-white border border-gray-300 p-6 flex items-center justify-center text-sm">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="ml-1 text-[#0095f6] font-bold hover:underline"
          >
            {t("login")}
          </Link>
        </div>

        {/* Language Dropdown at the bottom */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <p className="text-[12px] text-gray-400">Get the app.</p>
          <div className="flex gap-2">
            <img 
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7YmS_iX.png" 
              alt="App Store" 
              className="h-10 cursor-pointer"
            />
            <img 
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png" 
              alt="Google Play" 
              className="h-10 cursor-pointer"
            />
          </div>
          <SelectLanguage />
        </div>
      </div>
    </div>
  );
};

export default RegisterUi;
