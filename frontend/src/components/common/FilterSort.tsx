import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface FilterSortProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  status: string;
  sort: string;
}

const statusOptions = ['All', 'ACTIVE', 'CANCELLED'];
const sortOptions = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'Capacity (High)', value: 'capacity_desc' },
  { label: 'Capacity (Low)', value: 'capacity_asc' },
];

export const FilterSort: React.FC<FilterSortProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({ status: 'All', sort: 'date_desc' });
  const [openDropdown, setOpenDropdown] = useState<'status' | 'sort' | null>(null);

  const apply = (updated: Partial<FilterState>) => {
    const next = { ...filters, ...updated };
    setFilters(next);
    onFilterChange(next);
    setOpenDropdown(null);
  };

  const clear = () => apply({ status: 'All', sort: 'date_desc' });
  const hasActive = filters.status !== 'All' || filters.sort !== 'date_desc';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-slate-500" />

      {(['status', 'sort'] as const).map((key) => (
        <div key={key} className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <span className="capitalize">{key === 'status' ? filters.status : sortOptions.find(s => s.value === filters.sort)?.label}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openDropdown === key && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="absolute left-0 top-full z-20 mt-1 min-w-[150px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                {key === 'status'
                  ? statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => apply({ status: s })}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${filters.status === s ? 'font-semibold text-primary' : 'text-slate-700 dark:text-slate-200'}`}
                      >
                        {s}
                      </button>
                    ))
                  : sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => apply({ sort: o.value })}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${filters.sort === o.value ? 'font-semibold text-primary' : 'text-slate-700 dark:text-slate-200'}`}
                      >
                        {o.label}
                      </button>
                    ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <AnimatePresence>
        {hasActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clear}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
          >
            <X className="h-3 w-3" /> Clear
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
