"use client";

import React, { useState, useRef, useEffect } from "react";
import { IChat, IMessage } from "../../types/interface";
import { useSendMessageMutation } from "../../api/chat";

interface ChatViewProps {
  chat: IChat;
}

const COMMON_EMOJIS = ["❤️", "🙌", "🔥", "👏", "😢", "😍", "✨", "😂", "😮", "🌈"];

const ChatView: React.FC<ChatViewProps> = ({ chat }) => {
  const [messageText, setMessageText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = async (e?: React.FormEvent, file?: File) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !file) return;

    const formData = new FormData();
    formData.append("ChatId", chat.chatId.toString());
    if (messageText.trim()) {
      formData.append("MessageText", messageText);
    }
    if (file) {
      formData.append("File", file);
    }
    
    try {
      await sendMessage(formData).unwrap();
      setMessageText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSend(undefined, file);
    }
  };

  const addEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setIsEmojiOpen(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Recording animation logic
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#dbdbdb] flex items-center justify-between z-10 bg-white sticky top-0 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 transition-transform group-hover:scale-105">
               <img src={chat.chatPhoto || "/image.webp"} alt={chat.chatName} className="w-full h-full object-cover" />
             </div>
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#262626] leading-tight">
              {chat.chatName || chat.receiverUserId}
            </span>
            <span className="text-[11px] text-[#2db34a] font-medium animate-pulse">Active now</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="hover:opacity-40 transition-opacity">
            <svg aria-label="Phone" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M11.905 15.343a8.91 8.91 0 01-1.3-.186 10.978 10.978 0 01-4.757-2.316l-.01-.008L4.032 11.23a1 1 0 010-1.414l2.122-2.121a1 1 0 011.414 0l.966.966 1.768 1.767a1 1 0 010 1.415l-.234.234a4.11 4.11 0 001.378 1.378l.23-.229a1 1 0 011.415 0l2.733 2.734a1 1 0 010 1.414l-2.121 2.122a.994.994 0 01-.707.293z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path>
            </svg>
          </button>
          <button className="hover:opacity-40 transition-opacity">
            <svg aria-label="Video Call" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <rect fill="none" height="12" rx="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" width="14" x="2" y="6"></rect>
                <path d="M16 10l5-3v10l-5-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path>
            </svg>
          </button>
          <button className="hover:opacity-40 transition-opacity">
            <svg aria-label="Thread Details" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></circle>
              <path d="M12 11v5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path>
              <circle cx="12" cy="8" r="1.1"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 pb-28 flex flex-col gap-1.5 custom-scrollbar bg-white"
      >
        <div className="flex flex-col items-center py-12 mb-8">
             <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-100 mb-4 shadow-sm">
               <img src={chat.chatPhoto || "/image.webp"} alt={chat.chatName} className="w-full h-full object-cover" />
             </div>
             <h3 className="font-bold text-2xl text-[#262626] mb-1">{chat.chatName || chat.receiverUserId}</h3>
             <span className="text-sm text-[#737373]">Instagram · {chat.receiverUserId}</span>
             <button className="mt-5 bg-[#efefef] hover:bg-[#dbdbdb] text-[#262626] px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95">
                 View Profile
             </button>
        </div>

        <div className="text-center py-6">
           <span className="text-[11px] text-[#737373] uppercase tracking-[0.2em] font-bold">29 February 2024</span>
        </div>

        <div className="flex flex-col gap-1.5">
            {chat.messages?.map((msg, index) => {
              const isLastInGroup = index === chat.messages.length - 1 || chat.messages[index+1].isMine !== msg.isMine;
              
              return (
                <div 
                  key={msg.id || index}
                  className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-end gap-2.5 max-w-[85%]">
                    {!msg.isMine && isLastInGroup && (
                       <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                          <img src={chat.chatPhoto || "/image.webp"} className="w-full h-full object-cover" />
                       </div>
                    )}
                    {!msg.isMine && !isLastInGroup && <div className="w-7" />}
                    
                    <div 
                      className={`px-4 py-2.5 rounded-[22px] text-sm leading-[1.4] whitespace-pre-wrap shadow-sm ${
                        msg.isMine 
                          ? "bg-[#0095f6] text-white" 
                          : "bg-[#efefef] text-[#262626]"
                      } ${msg.isMine ? "rounded-br-[4px]" : "rounded-bl-[4px]"}`}
                    >
                      {msg.messageText}
                      {msg.file && (
                          <div className="mt-2.5 rounded-xl overflow-hidden border border-black/5 max-w-[280px]">
                             <img src={msg.file} alt="sent" className="w-full h-auto block" />
                          </div>
                      )}
                    </div>
                  </div>
                  {isLastInGroup && (
                    <span className={`text-[10px] text-[#737373] mt-1.5 font-medium ${msg.isMine ? "mr-1" : "ml-10"}`}>
                      {msg.isMine ? "Seen" : "08:32 AM"}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-6 left-0 right-0 px-5 bg-transparent z-20">
        <div className="max-w-[100%] mx-auto">
            {isEmojiOpen && (
            <div className="absolute bottom-full mb-3 p-2 bg-white border border-[#dbdbdb] rounded-2xl shadow-2xl flex gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {COMMON_EMOJIS.map(e => (
                <button key={e} onClick={() => addEmoji(e)} className="text-2xl hover:scale-125 transition-transform p-1">{e}</button>
                ))}
            </div>
            )}

            <div className={`flex items-center gap-3 border border-[#dbdbdb] rounded-[28px] px-4 py-2 bg-white transition-all shadow-sm ${isRecording ? "ring-2 ring-red-400 border-red-500" : "focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-400"}`}>
            <button 
                type="button" 
                onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                className="hover:opacity-40 transition-opacity flex-shrink-0"
            >
                <svg aria-label="Emoji" color="#262626" fill="#262626" height="26" role="img" viewBox="0 0 24 24" width="26">
                    <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 0a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zM12 18a5.33 5.33 0 01-4.73-2.81 1 1 0 111.76-.94A3.33 3.33 0 0012 16a3.33 3.33 0 002.97-1.75 1 1 0 011.76.94A5.33 5.33 0 0112 18z"></path>
                    <path d="M12 2.5a9.5 9.5 0 109.5 9.5 9.51 9.51 0 00-9.5-9.5zm0 17a7.5 7.5 0 117.5-7.5 7.51 7.51 0 01-7.5 7.5z"></path>
                </svg>
            </button>
            
            <form onSubmit={(e) => handleSend(e)} className="flex-1 flex items-center h-11">
                {isRecording ? (
                    <div className="flex-1 flex items-center gap-3 text-red-500 text-sm font-bold tracking-tight">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                        RECORDING... 0:01
                    </div>
                ) : (
                    <input 
                        type="text" 
                        placeholder="Message..." 
                        className="flex-1 text-[15px] outline-none bg-transparent placeholder:text-gray-400 font-medium"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                )}
                
                {(messageText.trim() || isRecording) ? (
                    <button type="submit" className="text-[#0095f6] font-bold text-[15px] hover:text-[#00376b] ml-3 transition-colors">
                    {isRecording ? "Stop" : "Send"}
                    </button>
                ) : null}
            </form>

            {!messageText.trim() && (
                <div className="flex items-center gap-4">
                <button 
                    type="button" 
                    onClick={toggleRecording}
                    className={`transition-all ${isRecording ? "text-red-500 scale-125" : "hover:opacity-40"}`}
                >
                    <svg aria-label="Voice Message" color="currentColor" fill="currentColor" height="26" role="img" viewBox="0 0 24 24" width="26">
                        <path d="M12 18a6 6 0 10-6-6 6.006 6.006 0 006 6zm0-10a4 4 0 11-4 4 4.004 4.004 0 014-4zm-8.834 8.16l1.22-.843a8 8 0 010-6.634l-1.22-.843A10.038 10.038 0 002 12c0 1.543.35 3.01.966 4.316zM20.834 7.84l-1.22.843a8 8 0 010 6.634l1.22.843A10.038 10.038 0 0022 12c0-1.543-.35-3.01-.966-4.316z"></path>
                    </svg>
                </button>
                
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:opacity-40 transition-opacity"
                >
                    <svg aria-label="Add Photo or Video" color="#262626" fill="#262626" height="26" role="img" viewBox="0 0 24 24" width="26">
                        <path d="M6.549 3.587a3.33 3.33 0 00-3.233 2.7l-1.07 5.35a1 1 0 00.981 1.197h17.545a1 1 0 00.982-1.196l-1.07-5.35a3.33 3.33 0 00-3.233-2.7z"></path>
                        <path d="M8.41 12.5a3.593 3.593 0 00-3.66 3.41c.072 2.212 1.935 3.916 4.143 3.75a3.597 3.597 0 003.413-3.66c-.072-2.212-1.935-3.916-4.143-3.75zm13.1 3.41c-.072-2.212-1.935-3.916-4.143-3.75a3.593 3.593 0 00-3.66 3.41c.072 2.212 1.935 3.916 4.143 3.75a3.597 3.597 0 003.413-3.66z"></path>
                    </svg>
                </button>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
