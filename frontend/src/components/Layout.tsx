import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutGrid, PlusCircle, User } from 'lucide-react';
import Logo from './Logo';
import GlobalLoader from './GlobalLoader';

interface LayoutProps {
  children: React.ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <AnimatePresence>
        {isNavigating && <GlobalLoader key="global-loader" />}
      </AnimatePresence>

      {}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {}
            <Link to="/" className="hover:opacity-80 transition-opacity invert brightness-0 grayscale">
              <Logo />
            </Link>

            {}
            <div className="flex items-center gap-8">
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 font-black transition-all text-xs uppercase tracking-widest ${location.pathname === '/dashboard' ? 'text-white underline underline-offset-8' : 'text-zinc-500 hover:text-white'}`}
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Discovery</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/create-event" 
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black transition-all hover:bg-zinc-200 active:scale-95 text-xs uppercase tracking-widest shadow-xl shadow-white/5"
                  >
                    <PlusCircle size={16} />
                    <span className="hidden sm:inline">Host Event</span>
                  </Link>
                  <div className="h-4 w-px bg-zinc-800" />
                  <div className="flex items-center gap-4">
                    <Link 
                      to="/profile"
                      className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all"
                      title="View Profile"
                    >
                      <User size={18} />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-zinc-600 hover:text-white transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-zinc-500 hover:text-white font-black transition-colors text-xs uppercase tracking-widest">
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-8 py-2.5 bg-white text-black rounded-xl font-black hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 text-xs uppercase tracking-widest"
                  >
                    Join Hub
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }} 
          >
            {children}
          </motion.main>
      </div>

      {}
      <footer className="border-t border-zinc-900 py-20 mt-20 bg-black">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest leading-loose">
            © 2026 EventHub discovery — Private Network.
          </p>
          <div className="flex gap-8 text-zinc-600 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
