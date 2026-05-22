import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  glass = false,
  variant = 'default',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-slate-800/50 border border-slate-700/50',
    elevated: 'bg-slate-800 border border-slate-700 shadow-lg',
    glass: 'glass',
    minimal: 'bg-transparent border border-slate-700/30',
  };

  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';

  const baseClasses = `rounded-xl p-5 transition-smooth ${variantClasses[variant]} ${hoverClasses}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
