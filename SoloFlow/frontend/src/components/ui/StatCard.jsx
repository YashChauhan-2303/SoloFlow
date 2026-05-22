import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

function AnimatedNumber({ value }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => {
    if (typeof value === 'number') {
      return Number.isInteger(value)
        ? Math.round(latest).toLocaleString()
        : latest.toFixed(1);
    }
    return value;
  });

  React.useEffect(() => {
    if (typeof value === 'number') {
      const controls = animate(motionVal, value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [value, motionVal]);

  if (typeof value !== 'number') {
    return <span>{value}</span>;
  }

  return <motion.span>{rounded}</motion.span>;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  className = '',
}) => {
  const isIncrease = changeType === 'increase';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden rounded-xl p-5
        bg-slate-800/50 border border-slate-700/50
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Background icon */}
      {Icon && (
        <div className="absolute top-4 right-4 text-slate-700/40">
          <Icon size={36} strokeWidth={1.5} />
        </div>
      )}

      <div className="relative z-10">
        <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">
          <AnimatedNumber value={value} />
        </p>

        {change !== undefined && change !== null && (
          <div className="flex items-center gap-1.5">
            {isIncrease ? (
              <TrendingUp size={14} className="text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span
              className={`text-xs font-medium ${
                isIncrease ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-slate-500">vs last period</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
