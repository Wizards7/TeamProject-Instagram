"use client";

import React, { useState } from "react";
import { Link, useRouter } from "../../i18n/navigation";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../api/Authenticator";
import { saveToken } from "../../utils/token";
import { ILoginRequest } from "../../types/interface";
import LoadingUi from "../LoadingUi";
import SelectLanguage from "../SelectLangUi";

const AppStoreBadge = () => (
    <img
      src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a04837.png"
      alt="App Store"
      className="h-full cursor-pointer w-auto"
    />
);

const GooglePlayBadge = () => (
    <img
      src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc548.png"
      alt="Google Play"
      className="h-full cursor-pointer w-auto"
    />
);

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
        setShowSplash(true);
        setTimeout(() => {
          window.location.href = "/";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-row items-center justify-center gap-12 max-w-[1000px] w-full mt-[-40px]">
        
        {/* LEFT SECTION: Static Phone Image (Visible on lg+) */}
        <div className="hidden lg:block relative w-[480px] h-[640px]">
          <img 
            src="/login_phone_large.png" 
            alt="Instagram" 
            className="w-full h-full object-contain select-none transform scale-125"
          />
        </div>

        {/* RIGHT SECTION: The Login Card */}
        <div className="flex flex-col gap-3 w-full max-w-[350px]">
          {/* Main Card */}
          <div className="bg-white border border-gray-300 px-10 py-10 flex flex-col items-center shadow-sm">
            {/* Instagram Logo */}
            <div className="mb-10 select-none scale-110">
              <i 
                className="bg-[url('https://static.cdninstagram.com/rsrc.php/v3/yS/r/aj_4-oR96_B.png')] bg-[position:0px_-52px] w-[175px] h-[51px] block"
                aria-label="Instagram"
                role="img"
              ></i>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2"
            >
              <input
                {...register("userName", { required: true })}
                type="text"
                placeholder="Phone number, username, or email"
                className="w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 py-[9px] text-[12px] focus:outline-none focus:border-gray-400"
              />

              <input
                {...register("password", { required: true, minLength: 6 })}
                type="password"
                placeholder="Password"
                className="w-full bg-[#fafafa] border border-gray-300 rounded-[3px] px-2 py-[9px] text-[12px] focus:outline-none focus:border-gray-400"
              />

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`mt-3 w-full py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${
                  isValid && !isLoading ? "bg-[#0095f6] hover:bg-[#1877f2]" : "bg-[#b2dffc]"
                }`}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              <div className="mt-5 mb-5 flex items-center gap-4 text-center">
                <div className="h-[1px] bg-gray-300 flex-1"></div>
                <span className="text-[13px] font-semibold text-gray-500 uppercase">
                  or
                </span>
                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>

              <button type="button" className="flex items-center justify-center gap-2 text-[#385185] font-semibold text-sm w-full">
                <span className="bg-[url('https://static.cdninstagram.com/rsrc.php/v3/yS/r/aj_4-oR96_B.png')] bg-[position:-414px_-259px] w-[16px] h-[16px] inline-block"></span>
                Log in with Facebook
              </button>

              {error && (
                <p className="text-[#ed4956] text-[14px] mt-6 text-center leading-4">
                  Sorry, your password was incorrect. Please double-check your password.
                </p>
              )}
              
              <Link href="#" className="mt-4 text-[#00376b] text-[12px] text-center hover:underline">
                Forgot password?
              </Link>
            </form>
          </div>

          {/* Switch Box */}
          <div className="bg-white border border-gray-300 py-6 flex items-center justify-center text-sm shadow-sm">
            <span>Don't have an account?</span>
            <Link href="/register" className="ml-1 text-[#0095f6] font-semibold hover:underline">
              Sign up
            </Link>
          </div>

          {/* Get the app section */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-[14px] font-medium">Get the app.</p>
            <div className="flex gap-2 items-center h-[40px] md:h-[42px]">
              <img
                src="/app_store_final.png"
                alt="App Store"
                className="h-full cursor-pointer w-auto object-contain"
              />
              <img
                src="/google_play_final.png"
                alt="Google Play"
                className="h-[135%] md:h-[140%] cursor-pointer w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 w-full max-w-[1015px] flex flex-col items-center gap-4 pb-12">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-gray-500">
          <span>Meta</span>
          <span>About</span>
          <span>Blog</span>
          <span>Jobs</span>
          <span>Help</span>
          <span>API</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Locations</span>
          <span>Instagram Lite</span>
          <span>Threads</span>
          <span>Contact Uploading & Non-Users</span>
          <span>Meta Verified</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-gray-500">
           <SelectLanguage />
           <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginUi;
