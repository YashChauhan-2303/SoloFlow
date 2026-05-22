import React from 'react';
import { motion } from 'framer-motion';

const Textarea = React.forwardRef(({
  label,
  placeholder,
  error,
  rows = 4,
  autoResize = false,
  className = '',
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const internalRef = React.useRef(null);
  const textareaRef = ref || internalRef;

  const handleInput = React.useCallback((e) => {
    if (autoResize) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [autoResize]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <motion.textarea
        ref={textareaRef}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        className={`
          w-full px-4 py-2.5 rounded-lg resize-none
          bg-slate-800/50 border transition-smooth
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
          ${autoResize ? 'overflow-hidden' : ''}
          ${className}
        `}
        animate={isFocused ? { boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' } : {}}
        {...rest}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1.5">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
