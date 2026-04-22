import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ATTENDEE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Encryption Keys Mismatch');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      const { token, user } = response.data;
      login(token, user);
      toast.success('Identity Created: Success');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Protocol Initialization Failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-black border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-black order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="mb-12">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
              Join Hub
            </h2>
            <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">Initialize New Entity Profile</p>
          </div>

          {error && (
            <div className="p-4 mb-8 text-xs font-black uppercase tracking-widest text-white bg-zinc-900 border border-white/10 rounded-2xl">
              Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-zinc-900 py-3 pl-8 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight text-sm"
                  placeholder="FULL NAME"
                />
              </div>
              <div className="relative group">
                <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-zinc-900 py-3 pl-8 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight text-sm"
                  placeholder="EMAIL ADDRESS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-zinc-900 py-3 pl-8 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight text-sm"
                  placeholder="PASSWORD"
                />
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-zinc-900 py-3 pl-8 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight text-sm"
                  placeholder="CONFIRM KEY"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <UserPlus size={14} /> Network Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-zinc-950 text-white rounded-xl py-4 px-6 focus:ring-1 focus:ring-white outline-none appearance-none border border-white/5 cursor-pointer font-black grayscale transition-all uppercase tracking-widest text-[10px]"
              >
                <option value="ATTENDEE">Attendee (User Node)</option>
                <option value="ORGANIZER">Organizer (Lead Node)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ x: 5 }}
              type="submit"
              disabled={loading}
              className="w-full py-6 px-10 bg-white text-black rounded-2xl font-black flex items-center justify-between group transition-all mt-8 active:scale-[0.98] shadow-2xl"
            >
              <span className="uppercase tracking-widest text-xs">{loading ? 'Initializing...' : 'Join Network'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-12 text-center text-zinc-700 font-black uppercase tracking-widest text-[10px]">
            Already Integrated?{' '}
            <Link to="/login" className="text-white hover:underline underline-offset-8 transition-all ml-2 font-black">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 items-center justify-center order-1 lg:order-2 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
        
        <div className="relative z-10 p-16 text-right space-y-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-end gap-2 text-white mb-6 font-black tracking-[0.2em] uppercase text-[10px] bg-white/5 w-fit ml-auto px-4 py-2 border border-white/10 rounded-lg">
              <ShieldCheck size={14} />
              Global Consensus
            </div>
            <h3 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">
              Connect Across <br /> Every Node.
            </h3>
            <p className="text-zinc-500 text-lg font-medium max-w-sm ml-auto leading-relaxed">
              Join the most exclusive collective of professional creators and innovators.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
