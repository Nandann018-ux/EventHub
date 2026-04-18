import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface RegistrationFormProps {
  event: { id: string; title: string; dateTime: string; venue: string };
  onRegister: (eventId: string) => Promise<void>;
  onClose?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onRegister, onClose }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) { setError('Please confirm your attendance.'); return; }
    setIsLoading(true); setError('');
    try {
      await onRegister(event.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">You're registered!</h3>
            <p className="text-sm text-slate-500">See you at <strong>{event.title}</strong>.</p>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">Event</p>
              <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(event.dateTime).toLocaleDateString()} · {event.venue}
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => { setConfirmed(e.target.checked); setError(''); }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                I confirm my attendance and understand that cancellations should be made at least 24 hours in advance.
              </span>
            </label>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3">
              {onClose && <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>}
              <Button variant="primary" type="submit" isLoading={isLoading}>Confirm Registration</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
