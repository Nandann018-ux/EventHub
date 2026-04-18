import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Calendar, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-[90vh] w-full">
      {/* Left side: Branding & Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex lg:w-5/12 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark/40 to-slate-900 mix-blend-overlay" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EventHub</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mt-12 flex-1">
          <h1 className="text-4xl font-bold leading-tight mb-8">
            Start discovering amazing events today.
          </h1>
          
          <div className="flex flex-col gap-6">
            {[
              'Secure your spot at exclusive events',
              'Track all your upcoming registrations',
              'Get notifications for event updates',
              'Seamlessly check-in to activities'
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center gap-3 text-slate-300"
              >
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </motion.div>

      {/* Right side: Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex w-full items-center justify-center bg-slate-50 p-6 pt-12 lg:w-7/12 dark:bg-slate-900"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/40 dark:bg-slate-800 dark:shadow-slate-900/50">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light">
                Sign in
              </Link>
            </p>
          </div>

          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};
