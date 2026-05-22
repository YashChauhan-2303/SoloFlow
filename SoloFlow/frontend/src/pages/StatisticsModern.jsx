import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Users, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import NavbarModern from '../components/NavbarModern';
import PageTransition from '../components/PageTransition';
import { Card, Badge } from '../components/ui';
import { PageContainer, PageHeader, PageGrid } from '../components/layouts';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const frame = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ icon: Icon, label, value, trend, color = 'purple', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card variant="elevated">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 flex items-center justify-center`}>
          <Icon size={24} className={`text-${color}-400`} />
        </div>
        {trend && (
          <motion.div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <TrendingUp size={14} />
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
      <motion.div
        className="text-3xl font-bold text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {typeof value === 'number' ? (
          <>
            <AnimatedCounter end={value} duration={1.5} />
            {label.includes('Revenue') && <span className="text-xl ml-1">$</span>}
          </>
        ) : (
          value
        )}
      </motion.div>
    </Card>
  </motion.div>
);

const StatisticsModern = () => {
  const { user_id } = useParams();
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${user_id}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          toast.error('Failed to load statistics');
          return;
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user_id, token]);

  const kpis = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: Math.floor(stats.totalRevenue),
      trend: 12,
      color: 'emerald',
    },
    {
      icon: Users,
      label: 'Active Clients',
      value: stats.totalClients,
      trend: 5,
      color: 'blue',
    },
    {
      icon: Zap,
      label: 'Active Projects',
      value: stats.totalProjects,
      trend: 8,
      color: 'amber',
    },
    {
      icon: Calendar,
      label: 'Tasks Completed',
      value: stats.completedTasks,
      trend: 15,
      color: 'purple',
    },
  ];

  const periods = ['week', 'month', 'quarter', 'year'];

  return (
    <PageTransition>
      <NavbarModern />
      <PageContainer className="py-8">
        {/* Page Header */}
        <PageHeader
          title="Statistics"
          subtitle="Performance metrics and business insights"
        />

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 flex-wrap"
        >
          {periods.map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* KPI Cards */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold text-slate-100 mb-6"
          >
            Key Performance Indicators
          </motion.h2>
          <PageGrid cols={4} responsive gap="gap-6">
            {kpis.map((kpi, i) => (
              <StatCard key={i} {...kpi} delay={i * 0.1} />
            ))}
          </PageGrid>
        </div>

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card variant="elevated">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">Revenue Breakdown</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Services', percentage: 65, value: '$6,500' },
                { label: 'Projects', percentage: 25, value: '$2,500' },
                { label: 'Other', percentage: 10, value: '$1,000' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <span className="text-sm font-bold text-slate-100">{item.value}</span>
                  </div>
                  <motion.div
                    className="h-2 bg-slate-700 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${
                        i === 0 ? 'from-emerald-500 to-teal-500' :
                        i === 1 ? 'from-blue-500 to-cyan-500' :
                        'from-purple-500 to-pink-500'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: item.percentage / 100 }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 1 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card variant="elevated">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">Top Clients</h3>
            
            <div className="space-y-4">
              {[
                { name: 'Acme Corp', revenue: '$15,400', status: 'active' },
                { name: 'Tech Startup', revenue: '$12,300', status: 'active' },
                { name: 'Creative Studio', revenue: '$9,800', status: 'pending' },
              ].map((client, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
                    <div>
                      <p className="font-medium text-slate-100">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.revenue}</p>
                    </div>
                  </div>
                  <Badge
                    variant={client.status === 'active' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {client.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </PageContainer>
    </PageTransition>
  );
};

export default StatisticsModern;
