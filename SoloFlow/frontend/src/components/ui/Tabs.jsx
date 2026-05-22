import React from 'react';
import { motion } from 'framer-motion';

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-center gap-1 p-1 rounded-xl
        bg-slate-800/50 border border-slate-700/50
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const TabIcon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium transition-colors duration-200
              cursor-pointer
              ${isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {TabIcon && <TabIcon size={16} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
