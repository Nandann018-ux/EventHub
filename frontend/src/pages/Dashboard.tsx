import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, AlertCircle, RefreshCw, Filter, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventCard, { EventHubEvent } from '../components/EventCard';
import EventSkeleton from '../components/EventSkeleton';
import SearchBar from '../components/SearchBar';


const MOCK_EVENTS: EventHubEvent[] = [
  {
    id: 'mock-1',
    title: 'AI & Machine Learning Vision Summit',
    description: 'A premier gathering of AI researchers and industry leaders in Pune. Exploring GPT-5 and beyond.',
    date: new Date('2026-06-15T09:00:00Z').toISOString(),
    location: 'Pune, Maharashtra',
    capacity: 500,
    organizerId: 'user-1',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&sat=-100',
    organizer: { name: 'Nandan Achar', email: 'organizer@eventhub.com' }
  },
  {
    id: 'mock-2',
    title: 'Global React Hackathon 2026',
    description: 'The world\'s largest frontend hackathon hosted in the Silicon Valley of India.',
    date: new Date('2026-07-20T10:00:00Z').toISOString(),
    location: 'Bangalore, Karnataka',
    capacity: 200,
    organizerId: 'user-1',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop&sat=-100',
    organizer: { name: 'Nandan Achar', email: 'organizer@eventhub.com' }
  },
  {
    id: 'mock-3',
    title: 'FinTech Revolution Conference',
    description: 'Exploring the future of digital payments in India\'s financial capital.',
    date: new Date('2026-08-12T09:30:00Z').toISOString(),
    location: 'Mumbai, Maharashtra',
    capacity: 400,
    organizerId: 'user-1',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=2070&auto=format&fit=crop&sat=-100',
    organizer: { name: 'Nandan Achar', email: 'organizer@eventhub.com' }
  }
];

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  
  const discoveryRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const scrollToDiscovery = () => {
    discoveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await api.get('/events');
      if (response.data && response.data.length > 0) {
        setEvents(response.data);
      } else {
        setEvents(MOCK_EVENTS);
      }
    } catch (err: any) {
      console.error('Fetch failed:', err);
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = 
        locationFilter === '' || 
        locationFilter === 'All Locations' || 
        event.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesLocation;
    });
  }, [events, searchTerm, locationFilter]);

  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(0, visibleCount);
  }, [filteredEvents, visibleCount]);

  return (
    <div className="py-10 space-y-20">
      {}
      <section className="relative py-20 md:py-32 overflow-hidden rounded-[4rem] bg-black border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              The Pulse of <br />
              <span className="text-white underline decoration-zinc-800 underline-offset-[12px]">Intelligence.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with global pioneers at the world's most exclusive tech summits, hackathons, and expos.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={scrollToDiscovery}
              className="group flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl font-black text-lg transition-all hover:bg-zinc-200 active:scale-95 shadow-2xl shadow-white/5"
            >
              <Compass size={24} className="group-hover:rotate-45 transition-transform" />
              Explore Network
            </button>
            
            {isAuthenticated && (
              <Link 
                to="/create-event"
                className="px-12 py-5 bg-zinc-900 text-white rounded-2xl font-black text-lg border border-white/10 transition-all hover:bg-zinc-800 active:scale-95 shadow-xl"
              >
                Host Node
              </Link>
            )}
          </div>
        </div>
      </section>

      {}
      <div ref={discoveryRef} className="pt-10 space-y-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-zinc-900 rounded-2xl text-white border border-white/10 shadow-xl shadow-white/5">
            <LayoutGrid size={32} />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            Event Discovery
          </h2>
        </div>

        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />
      </div>

      {}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-48 rounded-[4rem] border border-zinc-900 bg-zinc-900/20 text-center">
            <Filter size={64} className="text-zinc-700 mb-8" />
            <p className="text-zinc-500 text-3xl font-black mb-4 tracking-tight">Zero Matches Found</p>
            <button 
              onClick={() => { setSearchTerm(''); setLocationFilter(''); }}
              className="mt-8 px-12 py-5 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-20">
            <motion.div
               layout
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {displayedEvents.map((event) => (
                  <motion.div 
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {}
            {visibleCount < filteredEvents.length && (
              <div className="flex justify-center pt-10">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 30)}
                  className="bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition-all font-semibold tracking-wide border border-neutral-800 shadow-xl"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
