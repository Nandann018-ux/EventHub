import React from 'react';
import { motion } from 'framer-motion';
import { MyRegistrations } from '../components/registration/MyRegistrations';
import { useRegistrations, useCancelRegistration } from '../hooks/useRegistrations';
import { useAuth } from '../hooks/useAuth';
import { ErrorState } from '../components/common/Error';

export const MyEventsPage: React.FC = () => {
  const { user } = useAuth();
  const { registrations, isLoading, error, refresh } = useRegistrations();
  const { cancelRegistration } = useCancelRegistration();

  const handleCancel = async (id: string) => {
    await cancelRegistration(id);
    refresh();
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <ErrorState message={error.message} onRetry={refresh} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          My Events
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your registrations and track your upcoming experiences, {user?.name?.split(' ')[0]}.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <MyRegistrations
          registrations={registrations}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </div>
    </motion.div>
  );
};
