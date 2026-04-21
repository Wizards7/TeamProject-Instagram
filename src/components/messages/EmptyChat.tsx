import React from "react";

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white">
      <div className="mb-4">
        <div className="w-[100px] h-[100px] rounded-full border-[2.5px] border-black flex items-center justify-center mx-auto mb-4">
          <svg
            aria-label="Direct"
            height="60"
            role="img"
            viewBox="0 0 24 24"
            width="60"
            className="text-black"
          >
             {/* Using a more modern looking path for Messenger icon */}
            <path
              d="M12.003 2c-5.523 0-10 4.079-10 9.11 0 2.859 1.442 5.412 3.7 7.12V22l3.41-1.87c.92.25 1.89.39 2.89.39 5.523 0 10-4.08 10-9.11S17.526 2 12.003 2zm4.64 8.78-3.15 4.95a1.14 1.14 0 0 1-1.74.22l-2.43-2.43-4.32 2.43c-.45.25-1-.22-.76-.69l3.15-4.95a1.14 1.14 0 0 1 1.74-.22l2.43 2.43 4.32-2.43c.45-.25 1 .22.76.69z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <h2 className="text-[20px] font-semibold text-[#262626] mb-2">Your messages</h2>
      <p className="text-sm text-[#737373] mb-8 max-w-[280px]">
        Send private photos and messages to a friend or group
      </p>
      <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95">
        Send message
      </button>
    </div>
  );
};

export default EmptyChat;
