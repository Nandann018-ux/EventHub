import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Ticket, 
  Share2, 
  Clock,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EventDetailsData {
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
  organizerId: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err: any) {
      console.error('Error fetching event:', err);
      toast.error('Event not found or server error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    setIsBooked(true);
    toast.success('Ticket Generated Successfully!');
  };

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&sat=-100';
  };

  if (loading) return (
    <div className="animate-pulse space-y-12">
      <div className="h-10 w-32 bg-zinc-900 rounded-xl mb-8" />
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-24 w-3/4 bg-zinc-900 rounded-[2rem]" />
          <div className="h-64 w-full bg-zinc-900 rounded-[3rem]" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-zinc-900 rounded-full" />
            <div className="h-4 w-full bg-zinc-900 rounded-full" />
            <div className="h-4 w-2/3 bg-zinc-900 rounded-full" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="h-96 w-full bg-zinc-900 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );

  if (!event) return null;

  const isOrganizer = currentUser?.id === event.organizerId;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative">
      {}
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-12 group p-2 -ml-2"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-black text-xs tracking-tight text-white uppercase tracking-widest">Discovery Network</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid lg:grid-cols-3 gap-16 items-start"
      >
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-zinc-900 border border-white/10 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Node</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] lg:max-w-4xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 px-6 py-4 rounded-2xl shadow-xl">
                <div className="p-2.5 bg-white/5 text-white rounded-xl border border-white/10">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Timeline</p>
                  <p className="text-sm font-bold text-white">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 px-6 py-4 rounded-2xl shadow-xl">
                <div className="p-2.5 bg-white/5 text-white rounded-xl border border-white/10">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sync Time</p>
                  <p className="text-sm font-bold text-white">{formattedTime}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-[32rem] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
            <img 
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575861501-7ad05823c93b?q=80&w=2070&auto=format&fit=crop&sat=-100'} 
              alt={event.title}
              onError={onImageError}
              className="w-full h-full object-cover filter grayscale brightness-75 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white flex items-center gap-4">
              <div className="w-1 h-12 bg-white rounded-full" />
              The Brief
            </h3>
            <p className="text-zinc-500 text-xl leading-relaxed whitespace-pre-wrap font-medium">
              {event.description}
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-8">
          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 pb-0 flex justify-between items-center">
              <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                <Share2 size={16} />
                Broadcast
              </button>
              {isOrganizer && (
                <div className="px-4 py-1.5 bg-white text-black rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-black">Lead Node</span>
                </div>
              )}
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white shadow-xl">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sector / Location</p>
                    <p className="text-lg font-black text-white leading-tight">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white shadow-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Node Density</p>
                    <p className="text-lg font-black text-white leading-tight">{event.capacity} Capacity</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <AnimatePresence mode="wait">
                  {!isBooked ? (
                    <motion.div
                      key="book-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <button 
                        onClick={handleBooking}
                        className="w-full py-6 bg-white text-black hover:bg-zinc-200 font-black text-xl rounded-full transition-all shadow-white/5 shadow-2xl flex items-center justify-center gap-4 active:scale-95 group"
                      >
                        <Ticket size={28} className="group-hover:rotate-12 transition-transform" />
                        Reserve Access
                      </button>
                      <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-6">
                        Encrypted Secure Protocol
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr-reveal"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="flex flex-col items-center gap-8 p-8 bg-white rounded-[2rem] shadow-2xl shadow-white/5"
                    >
                      <QRCodeSVG 
                        value={`eventhub-access-${event.id}`} 
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                      <div className="text-center">
                        <p className="text-black font-black text-lg uppercase tracking-tight">Access Granted</p>
                        <div className="mt-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Verified Secure</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
