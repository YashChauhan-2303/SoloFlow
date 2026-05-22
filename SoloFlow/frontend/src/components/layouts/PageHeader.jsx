import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  breadcrumbs,
  stats,
  gradientTitle = false,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-8 ${className}`}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm mb-4">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />
              )}
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-slate-400 hover:text-violet-400 transition-colors duration-200"
                >
                  {crumb.label || crumb}
                </button>
              ) : (
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? 'text-slate-200 font-medium'
                      : 'text-slate-400'
                  }
                >
                  {crumb.label || crumb}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
              <Icon size={24} className="text-violet-400" />
            </div>
          )}
          <div>
            {title && (
              <h1
                className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  gradientTitle ? 'sf-gradient-text' : 'text-slate-100'
                }`}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            {action}
          </motion.div>
        )}
      </div>

      {/* Optional stats row */}
      {stats && stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.06]"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                {stat.label}
              </span>
              <span className="text-lg font-semibold text-slate-100 mt-0.5">
                {stat.value}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;
