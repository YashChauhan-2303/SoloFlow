import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  options = [],
  error,
  icon: Icon,
  placeholder = 'Select an option',
  className = '',
  ...rest
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <motion.select
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg appearance-none
            bg-slate-800/50 border transition-smooth
            ${Icon ? 'pl-10' : ''}
            pr-10
            ${isFocused
              ? 'border-purple-500 shadow-lg shadow-purple-500/10'
              : 'border-slate-700'
            }
            ${error
              ? 'border-red-500 bg-red-500/5'
              : ''
            }
            text-slate-100
            focus:outline-none
            cursor-pointer
            ${className}
          `}
          animate={isFocused ? { boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' } : {}}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-800 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-slate-800 text-slate-100"
            >
              {opt.label}
            </option>
          ))}
        </motion.select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1.5">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
