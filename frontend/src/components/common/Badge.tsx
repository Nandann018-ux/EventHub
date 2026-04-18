import React from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'success' | 'pending' | 'cancelled' | 'attended' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  text: string;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  attended: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  info: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

const statusVariantMap: Record<string, BadgeVariant> = {
  REGISTERED: 'pending',
  CONFIRMED: 'success',
  CANCELLED: 'cancelled',
  ATTENDED: 'attended',
  ACTIVE: 'success',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'info', text, pulse }) => {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]}`}
    >
      {pulse && (
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500"
        />
      )}
      {text}
    </motion.span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variant = statusVariantMap[status] || 'info';
  const isPending = status === 'REGISTERED';
  return <Badge variant={variant} text={status} pulse={isPending} />;
};
