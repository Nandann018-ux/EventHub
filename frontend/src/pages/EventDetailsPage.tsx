import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EventDetails } from '../components/event/EventDetails';
import { useEventById, useEvents } from '../hooks/useEvents';
import { useRegistrations, useRegisterEvent } from '../hooks/useRegistrations';
import { useAuth } from '../hooks/useAuth';
import { ErrorState } from '../components/common/Error';
import { Loading } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import { EventList } from '../components/event/EventList';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { event, isLoading, error, refresh } = useEventById(id!);
  const { events: allEvents } = useEvents(); // for related events
  const { registrations } = useRegistrations();
  const { registerForEvent } = useRegisterEvent();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Check if current user is registered
  const userRegistration = registrations?.find((r) => r.eventId === id);
  const isRegistered = !!userRegistration;

  if (isLoading) return <div className="py-24"><Loading /></div>;
  if (error || !event) return <ErrorState message={error?.message || 'Event not found'} onRetry={refresh} />;

  // Find related events (simple logic: same venue or status, excluding current)
  const relatedEvents = (allEvents || [])
    .filter(e => e.id !== id && e.status === 'ACTIVE')
    .slice(0, 3);

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsRegisterModalOpen(true);
  };

  const handleRegistrationSubmit = async (eventId: string) => {
    await registerForEvent(eventId);
    refresh(); // Refresh event details to update capacity
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          { label: event.title }
        ]} />
      </div>

      <EventDetails
        event={event}
        isRegistered={isRegistered}
        registrationStatus={userRegistration?.status}
        isAdmin={user?.role === 'ADMIN'}
        onRegister={handleRegisterClick}
      />

      {relatedEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 mx-auto max-w-5xl"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">You might also like</h2>
          <EventList events={relatedEvents} onRegister={(eId) => navigate(`/events/${eId}`)} />
        </motion.div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register for Event"
      >
        <RegistrationForm
          event={event}
          onRegister={handleRegistrationSubmit}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
