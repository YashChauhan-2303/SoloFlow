import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:shadow-none',
    secondary:
      'bg-white/[0.06] text-slate-200 border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.12] disabled:opacity-50',
    ghost:
      'bg-transparent text-slate-300 hover:text-slate-100 hover:bg-white/[0.06] disabled:opacity-50',
    danger:
      'bg-red-600/90 text-white hover:bg-red-600 disabled:opacity-50',
    success:
      'bg-emerald-600/90 text-white hover:bg-emerald-600 disabled:opacity-50',
    outline:
      'bg-transparent text-violet-400 border border-violet-500/60 hover:bg-violet-500/10 hover:border-violet-400 disabled:opacity-50',
    icon:
      'bg-white/[0.06] text-slate-300 border border-white/[0.08] hover:bg-white/[0.1] hover:text-slate-100 disabled:opacity-50',
    link:
      'bg-transparent text-violet-400 hover:text-violet-300 underline-offset-4 hover:underline disabled:opacity-50 shadow-none',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-3.5 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-3.5 text-base gap-2.5',
  };

  const iconSizes = {
    xs: 'w-7 h-7 p-0',
    sm: 'w-8 h-8 p-0',
    md: 'w-10 h-10 p-0',
    lg: 'w-11 h-11 p-0',
    xl: 'w-12 h-12 p-0',
  };

  const spinnerSizes = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-3.5 h-3.5 border-[1.5px]',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-2',
    xl: 'w-5 h-5 border-2',
  };

  const iconComponentSizes = {
    xs: 14,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const isIconVariant = variant === 'icon';
  const sizeClasses = isIconVariant ? iconSizes[size] : sizes[size];

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-xl font-medium
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]
        cursor-pointer disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${variants[variant]} ${sizeClasses} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div
            className={`${spinnerSizes[size]} border-current border-t-transparent rounded-full animate-spin`}
          />
          {!isIconVariant && <span>Loading...</span>}
        </div>
      ) : (
        <>
          {Icon && <Icon size={iconComponentSizes[size]} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
