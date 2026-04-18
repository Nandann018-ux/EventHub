import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { EventList } from '../components/event/EventList';

// Mock featured events for the home page layout
const mockFeatured = [
  { id: '1', title: 'Global Tech Summit 2026', description: 'Join industry leaders for a 3-day deep dive into AI, Web3, and the future of tech.', dateTime: new Date(Date.now() + 86400000 * 7).toISOString(), venue: 'San Francisco Convention Center', maxCapacity: 2000, availableSlots: 156, status: 'ACTIVE' },
  { id: '2', title: 'Design Masters Workshop', description: 'Interactive design systems workshop with hands-on practice in Figma.', dateTime: new Date(Date.now() + 86400000 * 14).toISOString(), venue: 'Creative Hub Studio', maxCapacity: 50, availableSlots: 12, status: 'ACTIVE' },
  { id: '3', title: 'Startup Pitch Night', description: 'Watch 10 promising startups pitch to top-tier VC firms.', dateTime: new Date(Date.now() + 86400000 * 21).toISOString(), venue: 'Downtown Innovation Center', maxCapacity: 300, availableSlots: 0, status: 'ACTIVE' }
];

export const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleWords = 'Discover incredible events around you.'.split(' ');

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center pt-20">
        {/* Floating gradient backgrounds */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
          <div className="absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[120px] dark:bg-secondary/10" />
        </motion.div>

        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
            <motion.h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl dark:text-white">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="inline-block mr-3 lg:mr-4 last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300"
            >
              EventHub is your ultimate destination for finding, registering, and managing your next unforgettable experience.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="mt-4 flex flex-wrap justify-center gap-4"
            >
              <Link to="/events">
                <Button variant="primary" size="lg" icon={<Calendar className="h-5 w-5" />}>
                  Browse Events
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Create an Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Events</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Hand-picked events you don't want to miss.</p>
            </div>
            <Link to="/events" className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light">
              View all events 
              <motion.span whileHover={{ x: 4 }}><ArrowRight className="h-4 w-4" /></motion.span>
            </Link>
          </div>
          <EventList events={mockFeatured} />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How it Works</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Your journey from discovery to attendance in three simple steps.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Calendar, title: 'Find an Event', desc: 'Browse our curated list of events happening around you.' },
              { icon: Ticket, title: 'Register Securely', desc: 'Reserve your spot with just a few clicks. It is completely free.' },
              { icon: UserCheck, title: 'Attend & Enjoy', desc: 'Present your confirm status at the venue and enjoy the experience.' }
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-slate-900 opacity-90" />
        <div className="container relative mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            Ready to dive in?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-primary-50"
          >
            Join thousands of users discovering amazing events every day. It only takes a minute to get started.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-50">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
