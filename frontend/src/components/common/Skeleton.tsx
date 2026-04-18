import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = 'rounded-md',
}) => {
  return (
    <div className={`overflow-hidden ${height} ${width} ${rounded} bg-slate-200 dark:bg-slate-700 ${className}`}>
      <motion.div
        className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const EventCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-0 shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
    <Skeleton height="h-44" rounded="rounded-none" />
    <div className="flex flex-col gap-2 p-4">
      <Skeleton height="h-5" width="w-3/4" />
      <Skeleton height="h-4" width="w-1/2" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-9" className="mt-2" rounded="rounded-lg" />
    </div>
  </div>
);
