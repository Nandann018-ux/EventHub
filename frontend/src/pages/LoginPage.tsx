import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { Calendar } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-[90vh] w-full">
      {/* Left side: Branding & Value Prop */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex lg:w-5/12 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 to-slate-900 mix-blend-overlay" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EventHub</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome back to your event ecosystem.
          </h1>
          <p className="mt-4 text-slate-300">
            Sign in to manage your registrations, track your upcoming events, and discover what's happening next.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </motion.div>

      {/* Right side: Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex w-full items-center justify-center bg-slate-50 p-6 lg:w-7/12 dark:bg-slate-900"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/40 dark:bg-slate-800 dark:shadow-slate-900/50">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light">
                Register now
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};
