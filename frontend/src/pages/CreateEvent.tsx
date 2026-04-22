import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Users, AlignLeft, ArrowLeft, LayoutGrid, Plus } from 'lucide-react';
import api from '../services/api';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 50
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'capacity' ? parseInt(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/events', formData);
      toast.success('Node Initialized Successfully');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to initialize node.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-12 group p-2 -ml-2"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-bold text-sm tracking-tight text-white uppercase tracking-widest">Back to Hub</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-white/5 p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl mb-6">
              <Plus size={16} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node Generation</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-[0.9]">
              Host a <br /> New Node.
            </h2>
            <p className="text-zinc-500 font-medium text-lg">Broadcast your experience to the private network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              {}
              <div className="relative group">
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 ml-1">Experience Title</label>
                <div className="relative">
                  <input
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-zinc-800 py-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold text-2xl tracking-tight"
                    placeholder="ENTER NODE IDENTITY..."
                  />
                  <LayoutGrid size={24} className="absolute right-0 top-4 text-zinc-800 group-focus-within:text-white transition-colors" />
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Timeline</label>
                  <div className="relative group">
                    <input
                      name="date"
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/20 transition-all font-black uppercase text-xs tracking-widest grayscale"
                    />
                    <Calendar size={18} className="absolute right-6 top-4 text-zinc-800" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Sector / Location</label>
                  <div className="relative group">
                    <input
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/20 transition-all font-bold placeholder:text-zinc-800"
                      placeholder="PHYSICAL OR VIRTUAL"
                    />
                    <MapPin size={18} className="absolute right-6 top-4 text-zinc-800" />
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">Node Density (Capacity)</label>
                <div className="relative group">
                  <input
                    name="capacity"
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/20 transition-all font-bold"
                  />
                  <Users size={18} className="absolute right-6 top-4 text-zinc-800" />
                </div>
              </div>

              {}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">The Brief (Description)</label>
                <div className="relative group">
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-white/5 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-white/20 transition-all font-medium leading-relaxed resize-none placeholder:text-zinc-800"
                    placeholder="DEFINE THE EXPERIENCE OBJECTIVES..."
                  />
                  <AlignLeft size={20} className="absolute right-8 top-6 text-zinc-800" />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-8 bg-white text-black font-black text-xl rounded-full transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-widest"
            >
              {loading ? 'Initializing Node...' : 'Broadcast Node'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
