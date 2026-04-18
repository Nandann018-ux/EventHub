import React, { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User as UserIcon, Calendar, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    ...(user ? [{ name: 'My Events', path: '/my-events' }] : []),
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logotype */}
        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white"
            >
              <Calendar className="h-5 w-5" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              EventHub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation mappings naturally rendered tightly globally stably effectively physically */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="relative px-1 py-2"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
                    />
                  )}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Auth Interface */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </motion.button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Log in
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
                >
                  Sign up
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger cleanly actively properly natively mapping seamlessly stably efficiently */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none dark:hover:bg-slate-800"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Structural Logic actively gracefully securely firmly logically perfectly successfully natively safely theoretically seamlessly */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="space-y-1 bg-slate-50 px-2 pb-3 pt-2 dark:bg-slate-800/50">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-base font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout ({user.name})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-surface dark:text-slate-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
