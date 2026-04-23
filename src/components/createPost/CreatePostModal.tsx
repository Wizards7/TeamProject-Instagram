"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAddPostMutation } from "../../api/post";

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Select, 2: Caption
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addPost, { isLoading }] = useAddPostMutation();

  const isVideoFile = (file: File) => file.type.startsWith("video/");
  const isVideoUrl = (url: string) => {
    // Basic check if it's a data URL or blob URL for a video
    return url.startsWith("data:video/") || url.startsWith("blob:") && selectedFiles.some(f => isVideoFile(f));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
    });
  };

  const handleNext = () => {
    if (selectedFiles.length > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("Title", title || "New Post");
      formData.append("Content", content || "");
      
      selectedFiles.forEach((file) => {
        formData.append("Images", file);
      });

      await addPost(formData).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col w-full max-w-[800px] h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          {step === 2 ? (
            <button onClick={handleBack} className="text-gray-900">
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <span className="font-bold text-base">Create new post</span>
          {selectedFiles.length > 0 ? (
            <button 
              onClick={step === 1 ? handleNext : handleSubmit}
              disabled={isLoading}
              className="text-[#0095f6] font-bold text-sm hover:text-[#00376b] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : step === 1 ? "Next" : "Share"}
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Previews */}
          <div className={`relative flex-1 bg-gray-50 flex items-center justify-center ${step === 1 ? "w-full" : "w-[60%]"}`}>
            {previews.length > 0 ? (
              <div className="w-full h-full relative group">
                {selectedFiles[currentPreviewIdx] && isVideoFile(selectedFiles[currentPreviewIdx]) ? (
                  <video 
                    src={previews[currentPreviewIdx]} 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img 
                    src={previews[currentPreviewIdx]} 
                    className="w-full h-full object-contain"
                    alt="Preview"
                  />
                )}
                
                {previews.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentPreviewIdx(prev => Math.max(0, prev - 1))}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 ${currentPreviewIdx === 0 ? "hidden" : "block"}`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setCurrentPreviewIdx(prev => Math.min(previews.length - 1, prev + 1))}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 ${currentPreviewIdx === previews.length - 1 ? "hidden" : "block"}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {previews.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentPreviewIdx ? "bg-white" : "bg-white/50"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 rounded-full bg-gray-100 border border-gray-200">
                  <ImageIcon size={48} strokeWidth={1} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-light">Drag photos and videos here</h3>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#0095f6] text-white rounded-lg text-sm font-bold hover:bg-[#1877f2] transition-colors"
                >
                  Select from computer
                </button>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Right Side: Caption (Only on Step 2) */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "40%", opacity: 1 }}
                className="border-l border-gray-100 flex flex-col"
              >
                {/* User Info (Mock) */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                    <img src="/istockphoto-2151669184-612x612.jpg" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold">Your Profile</span>
                </div>

                {/* Textarea */}
                <div className="px-4 flex-1">
                  <textarea 
                    placeholder="Write a caption..."
                    className="w-full h-40 outline-none text-sm resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Additional Settings (Mock) */}
                <div className="p-4 border-t border-gray-50 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <span>Add location</span>
                    <Plus size={18} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <span>Accessibility</span>
                    <Plus size={18} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <span>Advanced settings</span>
                    <Plus size={18} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
