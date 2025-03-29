"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SoundButton } from "@/components/shared/SoundButton";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { motion } from "framer-motion";

// Example sounds - replace with your actual sounds
const SOUNDS = [
  "B Sound",
  "M Sound",
  "K Sound",
  "F Sound",
  "L Sound",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSounds = SOUNDS.filter((sound) =>
    sound.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-6xl p-8"
      >
        <h1 className="title mb-12 text-center">
          <span className="title-first">Let&apos;s </span>
          <span className="text-white">Articulate</span>
        </h1>

        <div className="mb-12 flex justify-center">
          <Input
            type="text"
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full max-w-md text-center"
          />
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {filteredSounds.map((sound, index) => (
            <motion.div
              key={sound}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                transform: `rotate(${Math.random() * 2 - 1}deg)`,
              }}
            >
              <SoundButton sound={sound} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatedBackground>
  );
}
