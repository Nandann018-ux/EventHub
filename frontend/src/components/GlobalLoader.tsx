import React from 'react';
import { motion } from 'framer-motion';


const GlobalLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="relative flex flex-col items-center gap-8">
        {}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 rounded-full border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        />

        {}
        <motion.div
          initial={{ letterSpacing: "0.2em", opacity: 0 }}
          animate={{ letterSpacing: "0.5em", opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-white text-xs font-black uppercase tracking-[0.5em]">
            EventHub Discovery
          </span>
        </motion.div>
      </div>

      {}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </motion.div>
  );
};

export default GlobalLoader;
