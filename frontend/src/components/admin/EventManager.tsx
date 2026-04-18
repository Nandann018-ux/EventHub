import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EventForm } from '../event/EventForm';
import { StatusBadge } from '../common/Badge';

interface EventManagerProps {
  events: any[];
  onCreateEvent: (data: any) => Promise<void>;
  onUpdateEvent: (id: string, data: any) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export const EventManager: React.FC<EventManagerProps> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDeleteEvent(deleteId);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Events</h2>
        <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          New Event
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <tr>
              {['Title', 'Date', 'Capacity', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-900 dark:divide-slate-800">
            {events.map((ev, i) => (
              <motion.tr
                key={ev.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.04 }}
                whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
                className="transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">{ev.title}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(ev.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{ev.maxCapacity}</td>
                <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditEvent(ev)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(ev.id)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">No events yet. Create one to get started.</p>
        )}
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Event" size="lg">
        <EventForm onSubmit={async (data) => { await onCreateEvent(data); setCreateOpen(false); }} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editEvent} onClose={() => setEditEvent(null)} title="Edit Event" size="lg">
        {editEvent && (
          <EventForm
            initialData={editEvent}
            onSubmit={async (data) => { await onUpdateEvent(editEvent.id, data); setEditEvent(null); }}
            onCancel={() => setEditEvent(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Event"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete this event? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
