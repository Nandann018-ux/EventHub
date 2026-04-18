import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const passwordStrength = (p: string) => {
    if (p.length === 0) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'][strength];

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password || !/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(form.password)) e.password = 'Min 6 chars, must include letters and numbers.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/my-events');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <motion.div variants={itemVariants}>
        <Input label="Full Name" placeholder="Jane Smith" value={form.name} onChange={update('name')} error={errors.name} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} error={errors.password} />
        {form.password && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`}
                  animate={{ scaleX: i <= strength ? 1 : 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">{strengthLabel}</p>
          </div>
        )}
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={update('confirmPassword')} error={errors.confirmPassword} success={!errors.confirmPassword && form.confirmPassword.length > 0 && form.password === form.confirmPassword} />
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
          Create account
        </Button>
      </motion.div>
    </motion.form>
  );
};
