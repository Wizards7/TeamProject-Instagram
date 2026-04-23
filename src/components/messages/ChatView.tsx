"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  Info,
  Smile,
  Mic,
  Image as LucideImage,
  Trash2,
  SendHorizontal,
  ChevronLeft,
  Edit3,
  Reply,
  Copy,
  X,
  Search,
  Check,
  Play,
  MoreHorizontal
} from "lucide-react";
import { useTranslations } from "next-intl";
import { IChat, IMessage } from "../../types/interface";
import {
  useSendMessageMutation,
  useGetChatByIdQuery,
  useDeleteMessageMutation,
  useDeleteChatMutation
} from "../../api/chat";

interface ChatViewProps {
  chat: IChat;
  onDeleteChat?: () => void;
}

const COMMON_REACTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

const VoiceMessagePlayer: React.FC<{ src: string, isMine: boolean }> = ({ src, isMine }) => {
  const t = useTranslations("Chat");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err);
          alert(t("errorPlayback"));
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setCurrentTime(audioRef.current.currentTime);
      const current = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(current);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const formatAudioTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`p-2 flex items-center gap-3 min-w-[240px] ${isMine ? "text-white" : "text-black"}`}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center transition-all shadow-sm ${isMine ? "bg-white/20 hover:bg-white/30" : "bg-black/5 hover:bg-black/10"}`}
      >
        {isPlaying ? (
          <div className="flex gap-1 items-center h-4">
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-current rounded-full" />
            <motion.div animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-current rounded-full" />
            <motion.div animate={{ height: [8, 14, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-current rounded-full" />
          </div>
        ) : (
          <Play size={20} fill="currentColor" className="ml-1" />
        )}
      </button>
      <div className="flex-1 flex flex-col gap-1.5 py-1">
        <div className="flex items-end gap-[2px] h-8 relative">
          {/* Waveform Bars */}
          {Array.from({ length: 35 }).map((_, i) => {
            // Stable height based on index to avoid jitter
            const height = 25 + Math.abs(Math.sin(i * 0.8)) * 50 + (i % 3) * 5;
            const isFilled = (i / 35) * 100 <= progress;
            return (
              <div
                key={i}
                style={{ height: `${Math.max(6, height)}%` }}
                className={`w-[2px] rounded-full transition-colors duration-300 ${isFilled ? "bg-current" : "bg-current opacity-20"}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center opacity-70 text-[10px] font-bold tracking-tight">
          <span>{formatAudioTime(currentTime)}</span>
          <div className="flex items-center gap-1">
            <Mic size={10} />
            <span className="uppercase">{t("voice")}</span>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="auto"
        className="hidden"
        onError={() => console.error("Audio Load Error for:", src)}
      />
    </div>
  );
};

const CallModal: React.FC<{ type: 'audio' | 'video', chat: IChat, onClose: (duration: number) => void }> = ({ type, chat, onClose }) => {
  const t = useTranslations("Chat");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const startCall = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: type === 'video',
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Call failed:", err);
        alert("Иҷозати камера ё микрофон дастрас нест.");
        onClose(0);
      }
    };
    startCall();

    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      clearInterval(timer);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    stream?.getTracks().forEach(t => t.stop());
    onClose(callDuration);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center text-white"
    >
      <div className="absolute top-10 flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
          {chat.receiveUserImage ? (
            <img src={`${process.env.NEXT_PUBLIC_VITE_API_URL}/images/${chat.receiveUserImage}`} alt="user" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-3xl font-bold uppercase">{chat.receiveUserName[0]}</div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{chat.receiveUserName}</h2>
          <p className="text-gray-400 mt-1">{type === 'video' ? `${t("videoCall")}...` : `${t("audioCall")}...`}</p>
          {callDuration > 0 && <p className="text-[#0095f6] font-mono mt-2 text-lg">{formatTime(callDuration)}</p>}
        </div>
      </div>

      {type === 'video' && (
        <div className="w-full h-full absolute inset-0 -z-10 bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
        </div>
      )}

      <div className="absolute bottom-20 flex items-center gap-8">
        <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all">
          <Mic size={28} />
        </button>
        <button
          onClick={handleEndCall}
          className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
        >
          <Phone size={32} fill="white" className="rotate-[135deg]" />
        </button>
        <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all">
          {type === 'video' ? <Video size={28} /> : <Phone size={28} />}
        </button>
      </div>
    </motion.div>
  );
};

const ChatView: React.FC<ChatViewProps> = ({ chat, onDeleteChat }) => {
  const t = useTranslations("Chat");
  const [messageText, setMessageText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<IMessage | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const isHoldingMicRef = useRef(false);

  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [deleteChat] = useDeleteChatMutation();
  const { data: messagesData, isLoading: messagesLoading } = useGetChatByIdQuery(chat.chatId, {
    pollingInterval: 3000,
  });

  const messages = messagesData?.data || [];
  const API_IMAGE_URL = `${process.env.NEXT_PUBLIC_VITE_API_URL}/images/`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const msgMenuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (msgMenuRef.current && !msgMenuRef.current.contains(event.target as Node)) {
        setActiveMessageMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
          ? 'audio/ogg;codecs=opus'
          : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(audioBlob);
        const extension = mediaRecorder.mimeType.includes('webm') ? 'webm' : 'ogg';
        const file = new File([audioBlob], `voice_${Date.now()}.${extension}`, { type: mediaRecorder.mimeType });

        setPreviewAudioUrl(url);
        setRecordedFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setPreviewAudioUrl(null);
      setRecordedFile(null);
      setPreviewProgress(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Барои сабти овоз иҷозати микрофон лозим аст.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleMicPress = () => {
    isHoldingMicRef.current = true;
    startRecording();
  };

  const handleMicRelease = () => {
    if (isHoldingMicRef.current) {
      isHoldingMicRef.current = false;
      stopRecording();
    }
  };

  const handleDeletePreview = () => {
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
    }
    setPreviewAudioUrl(null);
    setRecordedFile(null);
    setIsPlayingPreview(false);
  };

  const togglePreviewPlay = () => {
    const audio = previewAudioRef.current;
    if (audio) {
      if (isPlayingPreview) {
        audio.pause();
      } else {
        // Илова кардани promise барои пешгирии хатогиҳои браузер
        audio.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlayingPreview(!isPlayingPreview);
    }
  };


  const onPreviewTimeUpdate = () => {
    if (previewAudioRef.current && previewAudioRef.current.duration) {
      const current = (previewAudioRef.current.currentTime / previewAudioRef.current.duration) * 100;
      setPreviewProgress(current);
    }
  };

  const onPreviewEnded = () => {
    setIsPlayingPreview(false);
    setPreviewProgress(0);
  };

  const handleSeekPreview = (e: React.MouseEvent<HTMLDivElement>) => {
    if (previewAudioRef.current && previewAudioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      previewAudioRef.current.currentTime = percentage * previewAudioRef.current.duration;
      setPreviewProgress(percentage * 100);
    }
  };

  const formatTimeSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async (e?: React.FormEvent, file?: File) => {
    if (e) e.preventDefault();
    const fileToSend = file || recordedFile;
    if (!messageText.trim() && !fileToSend) return;

    const formData = new FormData();
    formData.append("ChatId", chat.chatId.toString());
    if (messageText.trim()) formData.append("MessageText", messageText);
    if (fileToSend) formData.append("File", fileToSend);

    try {
      await sendMessage(formData).unwrap();
      setMessageText("");
      setReplyingTo(null);
      setEditingMessage(null);
      handleDeletePreview(); // Clear preview after sending
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setActiveMessageMenu(null);
  };

  const handleEdit = (msg: IMessage) => {
    setEditingMessage(msg);
    setMessageText(msg.messageText || "");
    setActiveMessageMenu(null);
  };

  const handleForward = (msg: IMessage) => {
    setForwardingMessage(msg);
    setActiveMessageMenu(null);
  };

  const handleLongPressStart = (msgId: number) => {
    longPressTimer.current = setTimeout(() => setActiveMessageMenu(msgId), 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleDelete = async (msgId: number) => {
    try {
      await deleteMessage(msgId).unwrap();
      setActiveMessageMenu(null);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleChatDelete = async () => {
    if (window.confirm(t("deleteConfirm"))) {
      try {
        await deleteChat(chat.chatId).unwrap();
        if (onDeleteChat) onDeleteChat();
      } catch (err) {
        console.error("Failed to delete chat:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans">
      <header className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between z-50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-50 flex items-center justify-center font-bold text-gray-400 bg-gray-50 shadow-sm transition-transform group-hover:scale-105">
              {chat.receiveUserImage ? (
                <img src={API_IMAGE_URL + chat.receiveUserImage} alt={chat.receiveUserName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">{chat.receiveUserName[0]}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-[#262626] leading-tight group-hover:text-gray-600 transition-colors">{chat.receiveUserName}</h2>
            <span className="text-[11px] text-gray-400 font-medium tracking-tight">{t("activeNow")}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#262626]">
          <button onClick={() => setActiveCall('audio')} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Phone size={22} /></button>
          <button onClick={() => setActiveCall('video')} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Video size={24} /></button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Info size={24} /></button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden">
                  <button onClick={handleChatDelete} className="w-full text-left px-5 py-3.5 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold text-sm">
                    <Trash2 size={18} /> {t("deleteChat")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-6 pb-28 custom-scrollbar">
        {messagesLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#0095f6] border-b-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col items-center py-8 mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-100 mb-4 shadow-sm bg-gray-50 flex items-center justify-center">
                {chat.receiveUserImage ? (
                  <img src={API_IMAGE_URL + chat.receiveUserImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-300">{chat.receiveUserName[0]}</span>
                )}
              </div>
              <h3 className="font-bold text-xl text-[#262626]">{chat.receiveUserName}</h3>
              <p className="text-[13px] text-gray-500 mt-1">Instagram · {chat.receiveUserName}</p>
              <button className="mt-4 px-5 py-1.5 bg-[#efefef] hover:bg-[#dbdbdb] rounded-lg text-sm font-bold transition-colors">{t("viewProfile")}</button>
            </div>

            <AnimatePresence initial={false}>
              {[...messages].reverse().map((msg, index) => {
                const isMine = msg.userId === chat.sendUserId;
                const isLastInGroup = index === messages.length - 1 || messages[index + 1].userId !== msg.userId;
                return (
                  <motion.div key={msg.messageId} layout initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex flex-col transition-all ${isMine ? "items-end ml-12" : "items-start mr-12"}`}>
                    <div className="relative group max-w-full">
                      <div className="flex items-end gap-2">
                        {!isMine && isLastInGroup && (
                          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center font-bold text-gray-300 text-[10px]">
                            {chat.receiveUserImage ? <img src={API_IMAGE_URL + chat.receiveUserImage} alt="user" className="w-full h-full object-cover" /> : <span>{chat.receiveUserName[0]}</span>}
                          </div>
                        )}
                        {!isMine && !isLastInGroup && <div className="w-7" />}
                        <div className="relative flex items-center gap-2 group/bubble-container">
                          {isMine && <button onClick={() => setActiveMessageMenu(msg.messageId)} className="opacity-0 group-hover/bubble-container:opacity-100 p-1.5 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black order-first"><MoreHorizontal size={18} /></button>}
                          {!isMine && <button onClick={() => setActiveMessageMenu(msg.messageId)} className="opacity-0 group-hover/bubble-container:opacity-100 p-1.5 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black order-last"><MoreHorizontal size={18} /></button>}
                          <motion.div
                            whileTap={{ scale: 0.98 }}
                            onContextMenu={(e) => { e.preventDefault(); setActiveMessageMenu(msg.messageId); }}
                            onMouseDown={() => handleLongPressStart(msg.messageId)}
                            onMouseUp={handleLongPressEnd}
                            onMouseLeave={handleLongPressEnd}
                            onTouchStart={() => handleLongPressStart(msg.messageId)}
                            onTouchEnd={handleLongPressEnd}
                            className={`px-4 py-2.5 rounded-[22px] text-[14.5px] leading-relaxed shadow-sm transition-all cursor-pointer relative ${isMine ? "bg-[#0095f6] text-white rounded-br-sm shadow-blue-500/10" : "bg-[#efefef] text-[#262626] rounded-bl-sm"} ${activeMessageMenu === msg.messageId ? "ring-2 ring-black/10 scale-[0.98] blur-[0.5px]" : "hover:opacity-95"}`}
                          >
                            {msg.messageText}
                            {msg.file && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-black/5 bg-transparent">
                                {msg.file.toLowerCase().match(/\.(webm|mp3|wav|ogg|m4a|aac)$/) ? (
                                  <VoiceMessagePlayer src={API_IMAGE_URL + msg.file} isMine={isMine} />
                                ) : (
                                  <img src={API_IMAGE_URL + msg.file} alt="file" className="max-w-full max-h-[300px] object-cover" />
                                )}
                              </div>
                            )}
                          </motion.div>
                          {index % 7 === 1 && <div className={`absolute -bottom-2 ${isMine ? "right-2" : "left-2"} bg-white rounded-full px-1.5 py-0.5 shadow-md border border-gray-100 flex items-center gap-0.5 scale-90 z-20`}><span className="text-[12px]">❤️</span></div>}
                          <AnimatePresence> 
                            {activeMessageMenu === msg.messageId && (
                              <div ref={msgMenuRef} className={`absolute z-[100] ${isMine ? "right-full mr-3 bottom-0" : "left-full ml-3 bottom-0"}`}>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 15 }} className="w-52 bg-[#1c1c1e]/95 backdrop-blur-xl rounded-[20px] shadow-2xl overflow-hidden border border-white/10">
                                  <div className="flex items-center justify-between px-3 py-3 border-b border-white/5 bg-white/5">{COMMON_REACTIONS.map(emoji => <motion.button key={emoji} whileHover={{ scale: 1.4, y: -2 }} whileTap={{ scale: 0.8 }} className="text-xl px-1">{emoji}</motion.button>)}</div>
                                  <div className="p-1.5 flex flex-col gap-0.5">
                                    <button onClick={() => handleEdit(msg)} className="flex items-center justify-between px-3.5 py-3 text-white text-[13px] font-medium hover:bg-white/10 rounded-xl transition-colors">{t("edit")} <Edit3 size={16} className="opacity-50" /></button>
                                    <button onClick={() => { setReplyingTo(msg); setActiveMessageMenu(null); }} className="flex items-center justify-between px-3.5 py-3 text-white text-[13px] font-medium hover:bg-white/10 rounded-xl transition-colors">{t("reply")} <Reply size={16} className="opacity-50" /></button>
                                    <button onClick={() => handleForward(msg)} className="flex items-center justify-between px-3.5 py-3 text-white text-[13px] font-medium hover:bg-white/10 rounded-xl transition-colors">{t("forward")} <SendHorizontal size={16} className="opacity-50" /></button>
                                    <button onClick={() => handleCopy(msg.messageText || "")} className="flex items-center justify-between px-3.5 py-3 text-white text-[13px] font-medium hover:bg-white/10 rounded-xl transition-colors">{t("copy")} <Copy size={16} className="opacity-50" /></button>
                                    <div className="h-[1px] bg-white/10 my-1 mx-2" />
                                    <button onClick={() => handleDelete(msg.messageId)} className="flex items-center justify-between px-3.5 py-3 text-[#ff453a] text-[13px] font-bold hover:bg-red-500/20 rounded-xl transition-colors">{t("unsend")} <Trash2 size={16} /></button>
                                  </div>
                                </motion.div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMine ? "flex-row-reverse mr-1" : "ml-9"}`}>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">{new Date(msg.sendMassageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMine && isLastInGroup && <span className="text-[10px] text-[#0095f6] font-bold">{t("seen")}</span>}
                        <span className="text-[9px] text-gray-300">{(() => { const diff = Math.floor((new Date().getTime() - new Date(msg.sendMassageDate).getTime()) / 60000); if (diff < 1) return t("justNow"); if (diff < 60) return `${diff}${t("minShort")}`; return ''; })()}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-5 z-40 bg-transparent">
        <div className="max-w-full mx-auto">
          <AnimatePresence>
            {(replyingTo || editingMessage) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gray-50 border-x border-t border-gray-200 p-3 rounded-t-3xl flex items-center justify-between text-[13px] shadow-sm mb-[-1px]">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-[#0095f6] h-8 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0095f6]">{replyingTo ? `${t("reply")} барои ${replyingTo.userName}` : t("edit")}</span>
                    <span className="text-gray-500 line-clamp-1">{replyingTo ? replyingTo.messageText : editingMessage?.messageText}</span>
                  </div>
                </div>
                <button onClick={() => { setReplyingTo(null); setEditingMessage(null); if (editingMessage) setMessageText(""); }} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X size={16} /></button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isEmojiOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} className="absolute bottom-full mb-4 p-3 bg-white border border-gray-100 rounded-3xl shadow-2xl min-w-[300px] grid grid-cols-6 gap-2 z-50 overflow-hidden">{["❤️", "🙌", "🔥", "👏", "😢", "😍", "✨", "😂", "😮", "🌈", "👍", "👎", "🙏", "💯", "🎉", "🙄", "🤔", "😴", "🚀", "💎", "✅", "❌", "⏰", "📍"].map(e => <button key={e} onClick={() => { setMessageText(prev => prev + e); setIsEmojiOpen(false); }} className="text-2xl p-2 hover:bg-gray-50 rounded-xl transition-all active:scale-125">{e}</button>)}</motion.div>
            )}
          </AnimatePresence>
          <div className={`flex items-center gap-3 bg-white border border-gray-200 rounded-[32px] px-5 py-2.5 shadow-xl transition-all shadow-black/5 ${isRecording ? "ring-2 ring-red-400" : "focus-within:border-gray-400"}`}>
            {!isRecording && !previewAudioUrl && <button onClick={() => setIsEmojiOpen(!isEmojiOpen)} className="p-1 hover:opacity-60 transition-opacity"><Smile size={26} /></button>}

            {isRecording && (
              <div className="flex items-center gap-3 flex-1 text-red-500 font-bold text-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                />
                <div className="flex items-end gap-0.5 h-4 px-2">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 4, 16, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                      className="w-1 bg-red-400 rounded-full"
                    />
                  ))}
                </div>
                {t("recording")} {formatTimeSeconds(recordingTime)}
              </div>
            )}

            {previewAudioUrl && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 flex-1 bg-gray-100/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 shadow-sm"
              >
                {/* Тугмаи нест кардан */}
                <button onClick={handleDeletePreview} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>

                <div className="flex-1 flex items-center gap-3">
                  {/* Тугмаи Play/Pause */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePreviewPlay}
                    className="w-9 h-9 rounded-full bg-[#0095f6] text-white flex items-center justify-center shadow-md active:bg-[#007ccf]"
                  >
                    {isPlayingPreview ? (
                      <div className="flex gap-1 items-center justify-center">
                        <div className="w-1 h-3.5 bg-white rounded-full"></div>
                        <div className="w-1 h-3.5 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <Play size={14} fill="currentColor" className="ml-1" />
                    )}
                  </motion.button>

                  {/* Прогресс Бар */}
                  <div
                    onClick={handleSeekPreview}
                    className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden relative cursor-pointer group"
                  >
                    <motion.div
                      style={{ width: `${previewProgress}%` }}
                      className="h-full bg-[#0095f6] transition-all duration-100 ease-linear relative"
                    >
                      {/* Ин "доирача" (thumb) барои зебоӣ ва эҳсоси Antigravity */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#0095f6] shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>

                  <span className="text-[11px] font-bold text-gray-500 min-w-[35px]">
                    {formatTimeSeconds(Math.floor(previewAudioRef.current?.currentTime || 0))}
                  </span>
                </div>

                {/* Теги Audio - МАХФӢ */}
                <audio
                  ref={previewAudioRef}
                  src={previewAudioUrl}
                  onTimeUpdate={onPreviewTimeUpdate}
                  onEnded={onPreviewEnded}
                  preload="auto"
                  className="hidden"
                />
              </motion.div>
            )}

            {!isRecording && !previewAudioUrl && (
              <form onSubmit={handleSend} className="flex-1 flex items-center">
                <input type="text" placeholder={t("messagePlaceholder")} value={messageText} onChange={(e) => setMessageText(e.target.value)} autoFocus className="flex-1 bg-transparent border-none outline-none text-[15px] py-1.5 font-medium placeholder:text-gray-400" />
                <AnimatePresence>{messageText.trim() && <motion.button initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} type="submit" className="ml-2 font-bold text-[#0095f6] hover:text-[#00376b] transition-colors">{editingMessage ? t("save") : t("send")}</motion.button>}</AnimatePresence>
              </form>
            )}

            <div className="flex items-center gap-4 px-1">
              {isRecording ? (
                <button onClick={stopRecording} className="text-[#0095f6] font-bold text-sm hover:scale-105 transition-transform">{t("finish")}</button>
              ) : previewAudioUrl ? (
                <button onClick={() => handleSend()} className="w-10 h-10 rounded-full bg-[#0095f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-[#00376b] transition-all active:scale-90">
                  <SendHorizontal size={20} />
                </button>
              ) : (
                <AnimatePresence>
                  {!messageText.trim() && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4">
                      <button
                        onMouseDown={handleMicPress}
                        onMouseUp={handleMicRelease}
                        onMouseLeave={handleMicRelease}
                        onTouchStart={handleMicPress}
                        onTouchEnd={handleMicRelease}
                        className="hover:opacity-60 transition-opacity relative"
                      >
                        <Mic size={26} />
                        {isRecording && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-[#0095f6] rounded-full -z-10"
                          />
                        )}
                      </button>
                      <label className="cursor-pointer hover:opacity-60 transition-opacity">
                        <LucideImage size={26} />
                        <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => handleSend(undefined, e.target.files?.[0])} accept="image/*,video/*" />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {forwardingMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between"><span className="font-bold text-lg">{t("forward")}</span><button onClick={() => setForwardingMessage(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button></div>
              <div className="p-4 bg-gray-50/50"><div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder={t("search")} className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 outline-none text-sm focus:border-[#0095f6]" /></div></div>
              <div className="flex-1 overflow-y-auto max-h-[400px] p-2">{["ali", "chokolate", "muhammadusuf", "dilshod", "parviz"].map(user => <div key={user} className="flex items-center justify-between p-3.5 hover:bg-neutral-50 rounded-2xl transition-colors group cursor-pointer"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-500 uppercase">{user[0]}</div><span className="font-semibold text-[#262626] font-sans">{user}</span></div><button className="bg-[#0095f6] hover:bg-[#00376b] text-white px-4 py-1.5 rounded-xl text-sm font-bold transition-all active:scale-95"> {t("send")} </button></div>)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeCall && (
          <CallModal
            type={activeCall}
            chat={chat}
            onClose={async (duration) => {
              setActiveCall(null);
              if (duration > 0) {
                const m = Math.floor(duration / 60);
                const s = duration % 60;
                const timeStr = `${m}:${s.toString().padStart(2, '0')}`;
                const typeStr = activeCall === 'video' ? t("videoCall") : t("audioCall");
                const formData = new FormData();
                formData.append("ChatId", chat.chatId.toString());
                formData.append("MessageText", `📞 ${typeStr} ${t("callEnded")} (${timeStr})`);
                try { await sendMessage(formData).unwrap(); } catch (e) { console.error(e); }
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatView;
