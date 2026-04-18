import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-8xl"
    >
      🔍
    </motion.div>
    <div>
      <h1 className="text-6xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Page not found</p>
    </div>
    <Link to="/">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-sm hover:bg-primary-dark"
      >
        Go back home
      </motion.button>
    </Link>
  </div>
);
