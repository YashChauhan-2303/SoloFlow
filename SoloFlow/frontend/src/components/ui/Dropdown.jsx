import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusIndex, setFocusIndex] = React.useState(-1);
  const containerRef = React.useRef(null);
  const menuRef = React.useRef(null);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const actionableItems = items.filter((item) => !item.divider);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex((prev) => (prev + 1) % actionableItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex((prev) => (prev - 1 + actionableItems.length) % actionableItems.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusIndex >= 0 && actionableItems[focusIndex]) {
          actionableItems[focusIndex].onClick?.();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusIndex(-1);
        break;
      default:
        break;
    }
  };

  const variantColors = {
    danger: 'text-red-400 hover:bg-red-500/10',
    default: 'text-slate-200 hover:bg-white/[0.06]',
  };

  let actionIndex = -1;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onKeyDown={handleKeyDown}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setFocusIndex(-1);
        }}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`
              absolute top-full mt-2 z-50 min-w-[180px]
              rounded-xl border border-white/[0.06] bg-[#111119]/95 backdrop-blur-xl
              shadow-2xl shadow-black/40 py-1.5 overflow-hidden
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1.5 border-t border-white/[0.06]"
                  />
                );
              }

              actionIndex++;
              const currentActionIndex = actionIndex;
              const variant = item.variant || 'default';
              const isFocused = currentActionIndex === focusIndex;

              return (
                <button
                  key={`item-${index}`}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2 text-sm
                    transition-colors duration-100 text-left
                    ${variantColors[variant]}
                    ${isFocused ? 'bg-white/[0.06]' : ''}
                  `}
                >
                  {item.icon && <item.icon size={16} className="flex-shrink-0 text-slate-400" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
