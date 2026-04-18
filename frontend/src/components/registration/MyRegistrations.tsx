import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationCard } from './RegistrationCard';
import { EmptyState } from '../common/EmptyState';
import { Skeleton } from '../common/Skeleton';
import { Calendar } from 'lucide-react';

interface MyRegistrationsProps {
  registrations: any[] | null;
  isLoading?: boolean;
  onCancel?: (id: string) => Promise<void>;
}

const filters = ['All', 'Upcoming', 'Past', 'Attended', 'Cancelled'] as const;
type Filter = typeof filters[number];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const MyRegistrations: React.FC<MyRegistrationsProps> = ({ registrations, isLoading, onCancel }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const now = new Date();

  const filtered = (registrations || []).filter((r) => {
    const eventDate = r.event?.dateTime ? new Date(r.event.dateTime) : null;
    if (activeFilter === 'Upcoming') return eventDate && eventDate > now && r.status !== 'CANCELLED';
    if (activeFilter === 'Past') return eventDate && eventDate <= now && r.status !== 'CANCELLED';
    if (activeFilter === 'Attended') return r.status === 'ATTENDED';
    if (activeFilter === 'Cancelled') return r.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFilter(f)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors
              ${activeFilter === f
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="h-28" rounded="rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          heading="No registrations found"
          description={activeFilter === 'All' ? "You haven't registered for any events yet." : `No ${activeFilter.toLowerCase()} registrations.`}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2"
          >
            {filtered.map((reg) => (
              <motion.div key={reg.id} variants={cardVariants} layout>
                <RegistrationCard registration={reg} onCancel={onCancel} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
