import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Calendar, CheckSquare } from 'lucide-react';

interface AdminDashboardProps {
  stats?: {
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
    attendanceRate: number;
  };
  isLoading?: boolean;
}

const defaultStats = { totalEvents: 0, totalUsers: 0, totalRegistrations: 0, attendanceRate: 0 };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const statCards = (stats: typeof defaultStats) => [
  { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'Registrations', value: stats.totalRegistrations, icon: BarChart2, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: CheckSquare, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats = defaultStats }) => {
  const cards = statCards(stats);

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            variants={cardVariants}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analytics charts coming soon — connect a charting library like Recharts to display registration trends.
        </p>
      </div>
    </div>
  );
};
