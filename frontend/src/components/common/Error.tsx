import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorProps> = ({ 
  message = "An unexpected error occurred while loading this content.", 
  onRetry 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-900/10"
    >
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Something went wrong</h3>
        <p className="max-w-md text-sm text-red-600/80 dark:text-red-400/80">{message}</p>
      </div>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;
