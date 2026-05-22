import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon,
  title = 'No data',
  description = 'Get started by creating something new',
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-4 p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20"
        >
          <Icon size={40} className="text-slate-400" />
        </motion.div>
      )}
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-center max-w-xs mb-6">{description}</p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
