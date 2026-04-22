import React from 'react';
import { motion } from 'framer-motion';


const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const iconVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2, 
        ease: "easeInOut",
      } 
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
      >
        {}
        <motion.path
          d="M20 30L50 10L80 30V70L50 90L20 70V30Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={iconVariants}
          className="text-blue-500"
        />
        <motion.path
          d="M50 10V90"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          variants={iconVariants}
          className="text-indigo-400"
          transition={{ delay: 0.5 }}
        />
        <motion.path
          d="M20 50H80"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          variants={iconVariants}
          className="text-emerald-400"
          transition={{ delay: 1 }}
        />
      </motion.svg>
      <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        EventHub
      </span>
    </div>
  );
};

export default Logo;
