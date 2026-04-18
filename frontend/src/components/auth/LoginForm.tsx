import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<typeof form>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = { email: '', password: '' };
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(form);
      navigate('/my-events');
    } catch (err: any) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <motion.div variants={itemVariants}>
        <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} error={errors.password} />
      </motion.div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {serverError}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Button variant="primary" size="lg" type="submit" isLoading={isLoading} className="w-full">
          Sign in
        </Button>
      </motion.div>
    </motion.form>
  );
};
