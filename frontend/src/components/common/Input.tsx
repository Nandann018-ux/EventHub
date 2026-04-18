import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <motion.input
            ref={ref}
            id={inputId}
            whileFocus={{ scale: 1.005 }}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all
              focus:outline-none focus:ring-2
              dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500
              ${icon ? 'pl-10' : ''}
              ${error
                ? 'border-red-400 focus:ring-red-300 dark:border-red-500'
                : success
                ? 'border-green-400 focus:ring-green-300 dark:border-green-500'
                : 'border-slate-300 focus:border-primary focus:ring-primary/30 dark:border-slate-600'
              }
              ${className}`}
            {...(props as any)}
          />
          {success && !error && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              ✓
            </motion.span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="text-xs text-red-500 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
