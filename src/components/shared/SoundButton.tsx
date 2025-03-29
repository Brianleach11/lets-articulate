"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SoundButtonProps {
  sound: string;
  isActive?: boolean;
  className?: string;
}

const COLORS = {
  "B Sound": "bg-yellow-300/90 hover:bg-yellow-300",
  "F Sound": "bg-pink-300/90 hover:bg-pink-300",
  "K Sound": "bg-pink-200/90 hover:bg-pink-200",
  "L Sound": "bg-yellow-200/90 hover:bg-yellow-200",
  "M Sound": "bg-emerald-300/90 hover:bg-emerald-300",
};

export const SoundButton = ({
  sound,
  isActive,
  className = "",
}: SoundButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`transform-gpu ${className}`}
    >
      <Link href={`/practice/${encodeURIComponent(sound)}`}>
        <Button
          variant="outline"
          className={`
            h-24 w-full min-w-[150px] rounded-2xl border-2 p-6 text-xl font-bold
            shadow-lg backdrop-blur-sm transition-all
            ${COLORS[sound as keyof typeof COLORS]}
            ${isActive ? "border-white/50" : "border-white/30"}
          `}
        >
          {sound.split(" ")[0]}
        </Button>
      </Link>
    </motion.div>
  );
};
