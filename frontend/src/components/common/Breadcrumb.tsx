import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-1 text-sm"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <motion.div key={item.label} variants={itemVariants} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            {isLast || !item.href ? (
              <span className={`font-medium ${isLast ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light"
              >
                {item.label}
              </Link>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
};
