import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';

interface EventDetailsProps {
  event: any;
  onRegister?: () => void;
  isRegistered?: boolean;
  isAdmin?: boolean;
  registrationStatus?: string;
}

const infoVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onRegister,
  isRegistered,
  registrationStatus,
}) => {
  const navigate = useNavigate();
  const date = new Date(event.dateTime);
  const isPast = date < new Date();
  const isFull = (event.availableSlots ?? event.maxCapacity) <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="h-32 w-full bg-gradient-to-r from-primary to-secondary" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{event.title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Organized by {event.createdBy?.name || 'EventHub'}
              </p>
            </div>
            <StatusBadge status={event.status} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Calendar, label: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
              { icon: MapPin, label: event.venue },
              { icon: Users, label: `${event.availableSlots ?? event.maxCapacity} / ${event.maxCapacity} slots remaining` },
              { icon: User, label: `Organizer: ${event.createdBy?.name || '—'}` },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={infoVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                {label}
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">About this event</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{event.description}</p>
          </div>

          {!isPast && (
            <div className="mt-6 flex items-center gap-4">
              {isRegistered ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Registered — {registrationStatus}
                  </span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isFull || event.status === 'CANCELLED'}
                  onClick={onRegister}
                >
                  {isFull ? 'Event Full' : event.status === 'CANCELLED' ? 'Cancelled' : 'Register Now'}
                </Button>
              )}
            </div>
          )}
          {isPast && (
            <p className="mt-6 text-sm italic text-slate-400">This event has already passed.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
