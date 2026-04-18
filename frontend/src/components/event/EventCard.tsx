import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  maxCapacity: number;
  availableSlots?: number;
  status: string;
}

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister, isRegistered }) => {
  const date = new Date(event.dateTime);
  const slots = event.availableSlots ?? event.maxCapacity;
  const isFull = slots <= 0;
  const isPast = date < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex h-10 w-full items-center bg-gradient-to-r from-primary/80 to-secondary/80 px-4">
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white ${event.status === 'ACTIVE' ? 'bg-white/20' : 'bg-red-500/60'}`}>
          {event.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{event.description}</p>

        <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {event.venue}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            {isFull ? (
              <span className="font-semibold text-red-500">Full</span>
            ) : (
              <span>{slots} / {event.maxCapacity} slots available</span>
            )}
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </Link>
          {!isPast && !isRegistered && onRegister && (
            <Button
              variant="primary"
              size="sm"
              disabled={isFull || event.status === 'CANCELLED'}
              onClick={() => onRegister(event.id)}
              className="flex-1"
            >
              {isFull ? 'Full' : 'Register'}
            </Button>
          )}
          {isRegistered && (
            <span className="flex flex-1 items-center justify-center rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Registered ✓
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
