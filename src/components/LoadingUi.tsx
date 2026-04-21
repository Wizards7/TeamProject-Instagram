"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Centered Instagram Glyph Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[80px] h-[80px] relative animate-pulse">
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="512"
              height="512"
              rx="100"
              fill="url(#paint0_linear)"
            />
            <path
              d="M344 112H168C137.072 112 112 137.072 112 168V344C112 374.928 137.072 400 168 400H344C374.928 400 400 374.928 400 344V168C400 137.072 374.928 112 344 112ZM368 344C368 357.255 357.255 368 344 368H168C154.745 368 144 357.255 144 344V168C144 154.745 154.745 144 168 144H344C357.255 144 368 154.745 368 168V344Z"
              fill="white"
            />
            <path
              d="M256 184C216.235 184 184 216.235 184 256C184 295.765 216.235 328 256 328C295.765 328 328 295.765 328 256C328 216.235 295.765 184 256 184ZM256 296C233.909 296 216 278.091 216 256C216 233.909 233.909 216 256 216C278.091 216 296 233.909 296 256C296 278.091 278.091 296 256 296Z"
              fill="white"
            />
            <circle cx="340" cy="172" r="12" fill="white" />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="512"
                y1="512"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#405DE6" />
                <stop offset="0.25" stopColor="#833AB4" />
                <stop offset="0.5" stopColor="#C13584" />
                <stop offset="0.75" stopColor="#FD1D1D" />
                <stop offset="1" stopColor="#F56040" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pb-16 flex flex-col items-center gap-1">
        <span className="text-[12px] text-gray-500 font-medium">from</span>
        <div className="flex items-center gap-2">
          {/* Meta Logo SVG */}
          <svg
            width="80"
            height="20"
            viewBox="0 0 100 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#0668E1]"
          >
            <path
              d="M12.5 18C15.5376 18 18 15.3137 18 12C18 8.68629 15.5376 6 12.5 6C9.46243 6 7 8.68629 7 12C7 15.3137 9.46243 18 12.5 18ZM21.5 12C21.5 16.4183 17.4706 20 12.5 20C7.52944 20 3.5 16.4183 3.5 12C3.5 7.58172 7.52944 4 12.5 4C17.4706 4 21.5 7.58172 21.5 12Z"
              fill="url(#meta_gradient)"
            />
            <text
              x="28"
              y="18"
              className="font-bold text-[18px]"
              fill="url(#meta_gradient)"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Meta
            </text>
            <defs>
              <linearGradient
                id="meta_gradient"
                x1="0"
                y1="12"
                x2="100"
                y2="12"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0668E1" />
                <stop offset="1" stopColor="#A41EF7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-[10px] text-gray-400 font-medium tracking-tight">
          © 2024 Instagram from Meta
        </p>
      </div>
    </div>
  );
};

export default Loading;
