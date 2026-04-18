import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const renderPages: (number | '...')[] = [];
  let prev = 0;
  for (const p of visible) {
    if (p - prev > 1) renderPages.push('...');
    renderPages.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {renderPages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${currentPage === p
                ? 'bg-primary text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
          >
            {p}
          </motion.button>
        )
      )}

      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
};
