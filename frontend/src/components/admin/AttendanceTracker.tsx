import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';

interface AttendanceTrackerProps {
  events: any[];
  onSelectEvent: (eventId: string) => void;
  registrations: any[];
  onMarkAttended: (registrationId: string) => Promise<void>;
  onMarkAllAttended: () => Promise<void>;
  selectedEventId?: string;
  isLoading?: boolean;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  events,
  onSelectEvent,
  registrations,
  onMarkAttended,
  onMarkAllAttended,
  selectedEventId,
  isLoading,
}) => {
  const [marking, setMarking] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const attended = registrations.filter((r) => r.status === 'ATTENDED').length;
  const total = registrations.length;

  const handleMark = async (id: string) => {
    setMarking(id);
    try { await onMarkAttended(id); } finally { setMarking(null); }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try { await onMarkAllAttended(); } finally { setMarkingAll(false); }
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Status', 'Registered At'],
      ...registrations.map((r) => [r.user?.name || '', r.user?.email || '', r.status, r.registeredAt]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Select Event</label>
          <select
            value={selectedEventId || ''}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">— Select an event —</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={exportCSV}>
              Export CSV
            </Button>
            <Button variant="primary" size="sm" isLoading={markingAll} onClick={handleMarkAll}>
              Mark All Attended
            </Button>
          </div>
        )}
      </div>

      {selectedEventId && total > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            <strong>{attended}</strong> / {total} attended
          </span>
          <div className="ml-auto h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${total > 0 ? (attended / total) * 100 : 0}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-slate-400">Loading registrations...</p>
        ) : registrations.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            {selectedEventId ? 'No registrations for this event.' : 'Select an event to view registrations.'}
          </p>
        ) : (
          registrations.map((reg, i) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 bg-white px-4 py-3 dark:bg-slate-900"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{reg.user?.name || '—'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{reg.user?.email || '—'}</p>
              </div>
              <StatusBadge status={reg.status} />
              {reg.status !== 'ATTENDED' && (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={marking === reg.id}
                  onClick={() => handleMark(reg.id)}
                >
                  Mark Attended
                </Button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
