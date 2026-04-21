"use client";

import React, { useState } from "react";
import { Link, useRouter } from "../i18n/navigation";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../api/Authenticator";
import { saveToken } from "../utils/token";
import { ILoginRequest } from "../types/interface";
import LoadingUi from "./LoadingUi";
import SelectLanguage from "./SelectLangUi";

const LoginUi = () => {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<ILoginRequest>({
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (value: ILoginRequest) => {
    try {
      const response = await login(value).unwrap();
      if (response && response.data) {
        saveToken(response.data);

        // Show Splash Screen (Sileo) for premium transition
        setShowSplash(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error In Login Ui", error);
    }
  };

  if (showSplash) {
    return <LoadingUi />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-row items-center justify-center gap-12 max-w-[850px] w-full">
        {/* LEFT SECTION: Phone Mockups */}
        <div className="hidden lg:block relative w-[380px] h-[580px]">
          <div className="absolute top-0 right-0 w-[250px] z-20">
            <img
              src="https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe255b74a5.png"
              alt="Phone"
              className="rounded-[30px] border-[8px] border-black shadow-2xl"
            />
          </div>
          <div className="absolute top-10 left-0 w-[250px] z-10 opacity-80">
            <img
              src="https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62f01a3548.png"
              alt="Phone Background"
              className="rounded-[30px] border-[8px] border-black shadow-xl"
            />
          </div>
        </div>

        {/* RIGHT SECTION: The Login Card */}
        <div className="flex flex-col gap-3 w-full max-w-[350px]">
          <div className="bg-white border border-gray-300 p-8 flex flex-col items-center">
            <h1
              className="text-[42px] mb-10"
              style={{ fontFamily: "var(--font-instagram)" }}
            >
              Instagram
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2"
            >
              <input
                {...register("userName", { required: true })}
                type="text"
                placeholder="Username"
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              <input
                {...register("password", { required: true, minLength: 6 })}
                type="password"
                placeholder="Password"
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] px-2 py-2 text-xs focus:outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`mt-4 w-full py-1.5 rounded-lg text-sm font-bold text-white transition-all ${
                  isValid && !isLoading ? "bg-[#0095f6]" : "bg-[#b2dffc]"
                }`}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
              {error && (
                <p className="text-red-500 text-[10px] mt-2 text-center">
                  Invalid username or password.
                </p>
              )}
            </form>

            <div className="mt-6 w-full flex items-center gap-4 text-center">
              <div className="h-[1px] bg-gray-300 flex-1"></div>
              <span className="text-[13px] font-bold text-gray-500 min-w-[30px]">
                OR
              </span>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>

            <button className="mt-6 text-[#385185] font-bold text-sm">
              Log in with Facebook
            </button>
          </div>

          <div className="bg-white border border-gray-300 p-6 flex items-center justify-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="ml-1 text-[#0095f6] font-bold">
              Sign up
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
    </div>
  );
};

export default LoginUi;
