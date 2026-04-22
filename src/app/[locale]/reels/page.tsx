import React from "react";

const ReelsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="w-24 h-24 mb-6 flex items-center justify-center">
         <img src="/video.svg" className="w-16 h-16" alt="Reels" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Reels</h2>
      <p className="text-gray-500 max-w-xs text-sm">
        Watch and create fun short videos on Instagram.
      </p>
      <button className="mt-6 bg-[#0095f6] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1877f2] transition-colors">
        Watch Reels
      </button>
    </div>
  );
};

export default ReelsPage;
