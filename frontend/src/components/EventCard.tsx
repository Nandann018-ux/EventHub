import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User as UserIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  organizer: {
    name: string;
    email: string;
  };
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement, globalThis.Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&sat=-100';
  };

  return (
    <Link to={`/event/${event.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="bg-black border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all group-hover:border-white/10"
      >
        {}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={event.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&sat=-100'} 
            alt={event.title}
            onError={onImageError}
            loading="lazy"
            className="w-full h-full object-cover filter grayscale brightness-75 group-hover:brightness-100 transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          {}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Date</p>
            <p className="text-xs font-bold text-white leading-none">{formattedDate}</p>
          </div>
        </div>

        {}
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Discovery Node</span>
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-zinc-300 transition-colors tracking-tight leading-tight line-clamp-2">
              {event.title}
            </h3>
            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed min-h-[40px] font-medium">
              {event.description}
            </p>
          </div>

          {}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 text-zinc-400">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Location</span>
                <span className="text-sm font-bold text-zinc-300 truncate max-w-[180px]">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;
