"use client";
import { logoutUser } from "@/src/utils/token";
import React from "react";

interface LogoutModalProps {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Log Out?
          </h3>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Are you sure you want to log out? You will need to enter your credentials to access your account again.
          </p>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => logoutUser()}
            className="w-full py-3.5 text-[15px] font-bold text-[#ed4956] hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 text-[15px] text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
