import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Calendar, Flag, AlertCircle, CheckCircle } from 'lucide-react';
import NavbarModern from '../components/NavbarModern';
import PageTransition from '../components/PageTransition';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { PageContainer, PageHeader, PageGrid } from '../components/layouts';
import { useTheme } from '../contexts/ThemeContext';

const DashboardModern = () => {
  const { user_id } = useParams();
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');
  
  const [boards, setBoards] = useState({
    backlog: { id: 'backlog', title: 'Backlog', color: 'bg-slate-600', tasks: [] },
    todo: { id: 'todo', title: 'To Do', color: 'bg-blue-600', tasks: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', color: 'bg-yellow-600', tasks: [] },
    completed: { id: 'completed', title: 'Completed', color: 'bg-emerald-600', tasks: [] }
  });
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${user_id}/dashboard`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          toast.error('Failed to load tasks');
          return;
        }

        const data = await response.json();
        const tasks = data.tasks || [];
        
        // Organize by status
        const organizedBoards = { ...boards };
        Object.keys(organizedBoards).forEach(id => organizedBoards[id].tasks = []);
        
        tasks.forEach(task => {
          if (task.task_priority === 1) organizedBoards.backlog.tasks.push(task);
          else if (task.task_priority === 3) organizedBoards.todo.tasks.push(task);
          else if (task.task_status === true) organizedBoards.completed.tasks.push(task);
          else organizedBoards.inProgress.tasks.push(task);
        });
        
        setBoards(organizedBoards);
        setStats({
          total: tasks.length,
          completed: tasks.filter(t => t.task_status === true).length,
          inProgress: tasks.filter(t => t.task_status === false).length
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user_id, token]);

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'danger',
      2: 'warning',
      3: 'info',
      4: 'default'
    };
    return colors[priority] || 'default';
  };

  const getPriorityLabel = (priority) => {
    const labels = { 1: 'High', 2: 'Medium', 3: 'Low', 4: 'Lowest' };
    return labels[priority] || 'Unknown';
  };

  const TaskCard = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      <Card className="hover:shadow-card-hover">
        <div className="space-y-3">
          {/* Task Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-100 text-sm leading-snug flex-1 line-clamp-2">
              {task.task_name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              ✕
            </motion.button>
          </div>

          {/* Description */}
          {task.task_description && (
            <p className="text-xs text-slate-400 line-clamp-2">
              {task.task_description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Flag size={14} className={`
                ${task.task_priority === 1 ? 'text-red-500' : ''}
                ${task.task_priority === 2 ? 'text-amber-500' : ''}
                ${task.task_priority === 3 ? 'text-blue-500' : ''}
                ${task.task_priority === 4 ? 'text-slate-500' : ''}
              `} />
              <Badge variant={getPriorityColor(task.task_priority)} size="xs">
                {getPriorityLabel(task.task_priority)}
              </Badge>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={12} />
                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          {task.task_rate && (
            <div className="pt-2 border-t border-slate-700/50">
              <div className="text-sm font-semibold text-emerald-400">
                ${task.task_rate.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  const ColumnHeader = ({ title, count, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-2 mb-4"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-slate-400" />}
        <h2 className="font-semibold text-slate-100">{title}</h2>
        <Badge variant="default" size="sm">{count}</Badge>
      </div>
    </motion.div>
  );

  return (
    <PageTransition>
      <NavbarModern />
      <PageContainer className="py-8">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          subtitle="Manage your tasks and projects efficiently"
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium transition-smooth hover:shadow-glow-purple"
            >
              <Plus size={18} />
              Add Task
            </motion.button>
          }
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, icon: '📋', color: 'from-blue-500 to-blue-600' },
            { label: 'In Progress', value: stats.inProgress, icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                  </div>
                  <div className={`text-3xl p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white/20`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(boards).map(([boardId, board]) => (
            <motion.div
              key={boardId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(boards).indexOf(boardId) * 0.1 }}
              className="flex flex-col"
            >
              {/* Column Header */}
              <ColumnHeader 
                title={board.title} 
                count={board.tasks.length}
                icon={[CheckCircle, AlertCircle, AlertCircle, CheckCircle][Object.keys(boards).indexOf(boardId)]}
              />

              {/* Tasks Container */}
              <div className="flex-1 bg-slate-900/20 rounded-xl p-4 border border-slate-800/50 min-h-96 space-y-3">
                <AnimatePresence mode="popLayout">
                  {board.tasks.length > 0 ? (
                    board.tasks.map((task) => (
                      <TaskCard key={task.task_id} task={task} />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex items-center justify-center"
                    >
                      <div className="text-center text-slate-600">
                        <p className="text-sm font-medium">No tasks yet</p>
                        <p className="text-xs mt-1">Add one to get started</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </PageTransition>
  );
};

export default DashboardModern;
