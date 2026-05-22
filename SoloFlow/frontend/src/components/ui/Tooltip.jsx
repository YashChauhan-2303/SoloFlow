import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const positionStyles = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-slate-700/90',
    arrowClasses: 'border-l-transparent border-r-transparent border-b-transparent border-t-[6px] border-l-[6px] border-r-[6px]',
    initial: { opacity: 0, y: 4, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: 4, x: '-50%' },
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-700/90',
    arrowClasses: 'border-l-transparent border-r-transparent border-t-transparent border-b-[6px] border-l-[6px] border-r-[6px]',
    initial: { opacity: 0, y: -4, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -4, x: '-50%' },
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-slate-700/90',
    arrowClasses: 'border-t-transparent border-b-transparent border-r-transparent border-l-[6px] border-t-[6px] border-b-[6px]',
    initial: { opacity: 0, x: 4, y: '-50%' },
    animate: { opacity: 1, x: 0, y: '-50%' },
    exit: { opacity: 0, x: 4, y: '-50%' },
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-slate-700/90',
    arrowClasses: 'border-t-transparent border-b-transparent border-l-transparent border-r-[6px] border-t-[6px] border-b-[6px]',
    initial: { opacity: 0, x: -4, y: '-50%' },
    animate: { opacity: 1, x: 0, y: '-50%' },
    exit: { opacity: 0, x: -4, y: '-50%' },
  },
};

const Tooltip = ({
  content,
  position = 'top',
  children,
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const pos = positionStyles[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={pos.initial}
            animate={pos.animate}
            exit={pos.exit}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 ${pos.container} pointer-events-none`}
          >
            <div className="relative px-3 py-1.5 rounded-lg bg-slate-700/90 backdrop-blur-sm border border-white/[0.06] shadow-xl">
              <span className="text-xs font-medium text-slate-100 whitespace-nowrap">
                {content}
              </span>
              <div className={`absolute ${pos.arrow} w-0 h-0 ${pos.arrowClasses}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
