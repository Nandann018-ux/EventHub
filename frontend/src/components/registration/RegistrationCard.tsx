import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, X } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';

interface RegistrationCardProps {
  registration: any;
  onCancel?: (id: string) => Promise<void>;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({ registration, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const event = registration.event;
  const date = event ? new Date(event.dateTime) : null;
  const canCancel = ['REGISTERED', 'CONFIRMED'].includes(registration.status);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel?.(registration.id);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
            {event?.title || 'Unknown Event'}
          </h3>
          {date && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          )}
          {event?.venue && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}
            </span>
          )}
          <p className="text-xxs text-slate-400 dark:text-slate-500">
            Registered {new Date(registration.registeredAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={registration.status} />
      </div>

      {canCancel && onCancel && (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
          <AnimatePresence mode="wait">
            {showConfirm ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span className="flex-1 text-xs text-slate-600 dark:text-slate-300">Cancel this registration?</span>
                <Button variant="danger" size="sm" isLoading={isLoading} onClick={handleCancel}>Yes</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>No</Button>
              </motion.div>
            ) : (
              <motion.button
                key="cancel-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" /> Cancel Registration
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
