import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-slate-700 text-slate-100',
    primary: 'bg-purple-600/30 text-purple-200 border border-purple-500/30',
    success: 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/30',
    warning: 'bg-amber-600/30 text-amber-200 border border-amber-500/30',
    danger: 'bg-red-600/30 text-red-200 border border-red-500/30',
    info: 'bg-blue-600/30 text-blue-200 border border-blue-500/30',
    high: 'bg-red-600/20 text-red-300',
    medium: 'bg-amber-600/20 text-amber-300',
    low: 'bg-blue-600/20 text-blue-300',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm',
  };

  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium transition-smooth';

  return (
    <motion.span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {Icon && <Icon size={14} />}
      {children}
    </motion.span>
  );
};

export default Badge;
