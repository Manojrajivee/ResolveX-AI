'use client';

import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const VoiceInputButton: React.FC<{ onSpeechResult?: (text: string) => void }> = ({ onSpeechResult }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        if (onSpeechResult) {
          onSpeechResult('Check status of postgresql service on production server');
        }
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleRecording}
        className={`p-2.5 rounded-xl transition-all ${
          isRecording
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
        title={isRecording ? 'Listening (3s simulation)...' : 'Voice Command Input'}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </motion.button>

      {isRecording && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-rose-600 text-white text-[10px] font-mono rounded font-bold whitespace-nowrap shadow-lg">
          Listening...
        </span>
      )}
    </div>
  );
};
