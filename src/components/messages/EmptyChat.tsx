"use client";

import React from "react";
import { motion } from "framer-motion";
import { SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmptyChatProps {
  onOpenNewChat: () => void;
}

const EmptyChat: React.FC<EmptyChatProps> = ({ onOpenNewChat }) => {
  const t = useTranslations("Chat");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background select-none text-foreground">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-[100px] h-[100px] rounded-full border-[2.5px] border-foreground flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <SendHorizontal size={50} strokeWidth={1} className="text-foreground -rotate-12 translate-x-1" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[22px] font-bold text-foreground mb-2 tracking-tight"
      >
        {t("emptyTitle")}
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground mb-8 max-w-[280px] font-medium leading-normal"
      >
        {t("emptyDesc")}
      </motion.p>

      <motion.button
        onClick={onOpenNewChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 active:shadow-none"
      >
        {t("emptyButton")}
      </motion.button>
    </div>
  );
};

export default EmptyChat;
