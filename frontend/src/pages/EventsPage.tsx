import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from '../components/common/Search';
import { FilterSort } from '../components/common/FilterSort';
import { Pagination } from '../components/common/Pagination';
import { EventList } from '../components/event/EventList';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { useRegistrations } from '../hooks/useRegistrations';
import { ErrorState } from '../components/common/Error';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // We'll mimic server-side search/filter/pagination internally for this component
  // in a real app, these states would be passed to the API via useEvents(params).
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState({ status: 'All', sort: 'date_desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Use the hooks we created previously
  const { events, isLoading, error, refresh } = useEvents();
  const { registrations } = useRegistrations();

  // If user is logged in, extract IDs of events they are already registered for
  const userRegistrationIds = user && registrations 
    ? registrations.map(r => r.eventId) 
    : [];

  const handleRegisterClick = (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/events/${eventId}`);
  };

  if (error) {
    return <ErrorState message={error.message} onRetry={refresh} />;
  }

  // 1. Client-side filtering & search
  let processedEvents = [...(events || [])];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    processedEvents = processedEvents.filter(
      e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
  }

  if (filterState.status !== 'All') {
    processedEvents = processedEvents.filter(e => e.status === filterState.status);
  }

  // 2. Client-side sorting
  processedEvents.sort((a, b) => {
    switch (filterState.sort) {
      case 'date_desc':
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      case 'date_asc':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      case 'capacity_desc':
        return b.maxCapacity - a.maxCapacity;
      case 'capacity_asc':
        return a.maxCapacity - b.maxCapacity;
      default:
        return 0;
    }
  });

  // 3. Client-side pagination
  const totalItems = processedEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentEvents = processedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Discover Events
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Find and register for the latest events happening around you.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 max-w-md"
        >
          <Search onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FilterSort onFilterChange={(f) => { setFilterState(f); setCurrentPage(1); }} />
        </motion.div>
      </div>

      <div className="mb-12 min-h-[400px]">
        <EventList 
          events={currentEvents} 
          isLoading={isLoading} 
          onRegister={handleRegisterClick}
          registeredEventIds={userRegistrationIds}
        />
      </div>

      {!isLoading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </motion.div>
      )}
    </div>
  );
};
