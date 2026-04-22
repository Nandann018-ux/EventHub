import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      toast.success('Initialize Session: Success');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Authentication Failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] bg-black border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      {}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
        
        <div className="relative z-10 p-16 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-white mb-6 font-black tracking-[0.2em] uppercase text-[10px] bg-white/5 w-fit px-4 py-2 border border-white/10 rounded-lg">
              <ShieldCheck size={14} />
              Verified Protocol
            </div>
            <h3 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">
              The Architecture <br /> of Tomorrow.
            </h3>
            <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed">
              Secure, high-fidelity experience management for professional network nodes.
            </p>
          </motion.div>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
              Enter Hub
            </h2>
            <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">Secure Authentication Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div className="relative group">
                <Mail size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-900 py-4 pl-10 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight"
                  placeholder="IDENTITY@NETWORK.COM"
                />
              </div>

              <div className="relative group">
                <Lock size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-900 py-4 pl-10 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all font-bold tracking-tight"
                  placeholder="ENCRYPTION KEY"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ x: 5 }}
              type="submit"
              disabled={loading}
              className="w-full py-6 px-10 bg-white text-black rounded-2xl font-black flex items-center justify-between group transition-all active:scale-[0.98] shadow-2xl"
            >
              <span className="uppercase tracking-widest text-xs font-black">{loading ? 'Verifying...' : 'Initialize Session'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-12 text-center text-zinc-700 font-black uppercase tracking-widest text-[10px]">
            New Entity?{' '}
            <Link to="/register" className="text-white hover:underline underline-offset-8 transition-all ml-2">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
