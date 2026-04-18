import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface EventFormData {
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  maxCapacity: number;
  status: 'ACTIVE' | 'CANCELLED';
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.06 } },
};
const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dateTime: initialData?.dateTime || '',
    venue: initialData?.venue || '',
    maxCapacity: initialData?.maxCapacity || 50,
    status: initialData?.status || 'ACTIVE',
  });
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: any = {};
    if (!form.title || form.title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
    if (!form.description || form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.';
    if (!form.venue) e.venue = 'Venue is required.';
    if (!form.dateTime || new Date(form.dateTime) <= new Date()) e.dateTime = 'Date must be in the future.';
    if (!form.maxCapacity || form.maxCapacity < 1) e.maxCapacity = 'Capacity must be at least 1.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof EventFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: field === 'maxCapacity' ? Number(e.target.value) : e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <motion.div variants={fieldVariants}>
        <Input label="Event Title" value={form.title} onChange={update('title')} error={errors.title as string} placeholder="e.g. Annual Tech Summit" />
      </motion.div>
      <motion.div variants={fieldVariants}>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          value={form.description}
          onChange={update('description')}
          rows={3}
          placeholder="Tell attendees what this event is about..."
          className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100 ${errors.description ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-primary focus:ring-primary/30 dark:border-slate-600'}`}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description as string}</p>}
      </motion.div>
      <motion.div variants={fieldVariants} className="grid gap-4 sm:grid-cols-2">
        <Input label="Date & Time" type="datetime-local" value={form.dateTime} onChange={update('dateTime')} error={errors.dateTime as string} />
        <Input label="Max Capacity" type="number" value={String(form.maxCapacity)} onChange={update('maxCapacity')} error={(errors as any).maxCapacity} min="1" />
      </motion.div>
      <motion.div variants={fieldVariants}>
        <Input label="Venue" value={form.venue} onChange={update('venue')} error={errors.venue as string} placeholder="e.g. Convention Center Hall A" />
      </motion.div>
      <motion.div variants={fieldVariants}>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
        <select
          value={form.status}
          onChange={update('status')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </motion.div>
      <motion.div variants={fieldVariants} className="flex justify-end gap-3 pt-2">
        {onCancel && <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>}
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData?.title ? 'Update Event' : 'Create Event'}
        </Button>
      </motion.div>
    </motion.form>
  );
};
