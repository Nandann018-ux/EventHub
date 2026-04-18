import React from 'react';
import { motion } from 'framer-motion';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Calendar } from 'lucide-react';

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

interface EventListProps {
  events: Event[] | null;
  isLoading?: boolean;
  onRegister?: (eventId: string) => void;
  registeredEventIds?: string[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const EventList: React.FC<EventListProps> = ({
  events,
  isLoading,
  onRegister,
  registeredEventIds = [],
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        heading="No events found"
        description="Check back later or adjust your filters."
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={onRegister}
          isRegistered={registeredEventIds.includes(event.id)}
        />
      ))}
    </motion.div>
  );
};
