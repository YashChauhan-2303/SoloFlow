import React from 'react';
import { motion } from 'framer-motion';

const Input = React.forwardRef(({
  label,
  placeholder,
  type = 'text',
  error,
  icon: Icon,
  rightElement,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <motion.input
          ref={ref}
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-slate-800/50 border transition-smooth
            ${Icon ? 'pl-10' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${isFocused
              ? 'border-purple-500 shadow-lg shadow-purple-500/10'
              : 'border-slate-700'
            }
            ${error
              ? 'border-red-500 bg-red-500/5'
              : ''
            }
            text-slate-100 placeholder-slate-500
            focus:outline-none
            ${className}
          `}
          animate={isFocused ? { boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' } : {}}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

