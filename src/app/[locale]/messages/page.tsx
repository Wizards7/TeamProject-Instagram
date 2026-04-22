import React from "react";

const MessagesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="w-24 h-24 mb-6 rounded-full border-2 border-black flex items-center justify-center">
        <svg aria-label="Messages" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="48" role="img" viewBox="0 0 24 24" width="48">
          <path d="M12.003 2.001a9.705 9.705 0 110 19.41 10.823 10.823 0 01-4.89-1.16l-4.639 1.22a.499.499 0 01-.613-.598l1.28-4.541A9.697 9.697 0 012.303 11.72a9.711 9.711 0 019.7-9.719zm0 2a7.711 7.711 0 00-7.7 7.719 7.67 7.67 0 001.377 4.427.5.5 0 01.06.311l-.906 3.21 3.11-.819a.498.498 0 01.308.045 7.681 7.681 0 003.751 1.027 7.711 7.711 0 007.7-7.719 7.711 7.711 0 00-7.7-7.719z" fillRule="evenodd"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
      <p className="text-gray-500 max-w-xs text-sm">
        Send private photos and messages to a friend or group.
      </p>
      <button className="mt-6 bg-[#0095f6] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1877f2] transition-colors">
        Send Message
      </button>
    </div>
  );
};

export default MessagesPage;
