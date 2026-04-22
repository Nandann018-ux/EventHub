import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, LogOut, Calendar, Plus, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventCard, { EventHubEvent } from '../components/EventCard';
import EventSkeleton from '../components/EventSkeleton';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<EventHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const myEvents = useMemo(() => {
    if (!user) return [];
    return events.filter(e => e.organizerId === user.id);
  }, [events, user]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      {}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center text-black shadow-2xl">
            <User size={56} strokeWidth={1.5} />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              {user?.name || 'Network Entity'}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 font-black bg-black/40 px-4 py-2 rounded-full w-fit border border-white/5 uppercase tracking-widest text-[10px]">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 rounded-2xl font-black transition-all border border-white/5 active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <LogOut size={20} />
            Initialize Disconnect
          </button>
        </div>
      </motion.div>

      {}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-white">
              <LayoutGrid size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              My Nodes
            </h2>
            <span className="bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-black ring-1 ring-white/5">
              {myEvents.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <EventSkeleton key={i} />)}
          </div>
        ) : myEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-center"
          >
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 mx-auto mb-6">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-widest">Zero Experience Node</h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-medium">
              Initialize your presence on the network by creating your first experience hub.
            </p>
            <Link 
              to="/create-event"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black transition-all hover:bg-zinc-200 active:scale-95 shadow-2xl group uppercase tracking-widest text-xs"
            >
              Initialize Node
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {myEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
