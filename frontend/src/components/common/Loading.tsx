import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface">
      <div className="h-48 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="flex flex-col gap-2">
        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};
