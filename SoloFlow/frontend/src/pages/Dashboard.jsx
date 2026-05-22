import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  X,
  LayoutDashboard,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { AppLayout, PageContainer, PageHeader } from '../components/layouts';
import { Card, Button, Input, Select, Textarea, Modal, Badge, StatCard } from '../components/ui';

const Dashboard = () => {
  const { user_id } = useParams();
  const token = localStorage.getItem('token');

  const [boards, setBoards] = useState({
    backlog: { id: 'backlog', title: 'Backlog', color: 'from-slate-600 to-slate-700', badgeColor: 'default', tasks: [] },
    todo: { id: 'todo', title: 'To Do', color: 'from-blue-600 to-indigo-600', badgeColor: 'info', tasks: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', color: 'from-amber-500 to-orange-600', badgeColor: 'warning', tasks: [] },
    review: { id: 'review', title: 'Review / Completed', color: 'from-emerald-500 to-teal-600', badgeColor: 'success', tasks: [] }
  });

  // State for price modal
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskPrice, setTaskPrice] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromBoard, setDraggedFromBoard] = useState(null);
  const [dragOverBoardId, setDragOverBoardId] = useState(null);

  // State for add task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState(3);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  // Board to status mapping (using numbers as per original model)
  const boardStatusMapping = {
    backlog: 3,
    todo: 2,
    inProgress: 1,
    review: 4
  };

  // Priority mapping (1: highest, 4: lowest)
  const priorityTextMapping = {
    1: 'high',
    2: 'medium-high',
    3: 'medium-low',
    4: 'low'
  };

  // Priority badge variants
  const priorityBadgeVariants = {
    1: 'danger',
    2: 'warning',
    3: 'info',
    4: 'default'
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${user_id}/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        toast.error('Failed to load tasks');
        return;
      }

      const data = await response.json();
      const tasks = data.tasks || [];
      
      const updatedBoards = {
        backlog: { ...boards.backlog, tasks: [] },
        todo: { ...boards.todo, tasks: [] },
        inProgress: { ...boards.inProgress, tasks: [] },
        review: { ...boards.review, tasks: [] }
      };

      tasks.forEach(task => {
        if (task.task_status === false) {
          if (task.task_priority === 3) updatedBoards.backlog.tasks.push(task);
          else if (task.task_priority === 2) updatedBoards.todo.tasks.push(task);
          else if (task.task_priority === 1) updatedBoards.inProgress.tasks.push(task);
        } else {
          updatedBoards.review.tasks.push(task);
        }
      });
      
      setBoards(updatedBoards);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error loading tasks');
    }
  };

  useEffect(() => {
    if (user_id && token) {
      fetchTasks();
    }
  }, [user_id, showTaskModal]);

  // Fetch projects when client changes
  useEffect(() => {
    if (selectedClient) {
      setLoadingProjects(true);
      fetch(`http://localhost:3000/${user_id}/${selectedClient}/projectdropdown`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const activeProjects = (data.projects || []).filter(
            project => project.status === false
          );
          setProjects(activeProjects);
          setLoadingProjects(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingProjects(false);
        });
    } else {
      setProjects([]);
    }
  }, [selectedClient]);

  // Fetch clients when modal opens
  useEffect(() => {
    if (showTaskModal) {
      fetch(`http://localhost:3000/${user_id}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setClients(data.clients || []))
        .catch(err => console.error(err));
    }
  }, [showTaskModal]);

  // Handler for regular board drops
  const handleRegularDrop = async (taskId, fromBoardId, toBoardId) => {
    const newPriority = boardStatusMapping[toBoardId];
    try {
      const response = await fetch(`http://localhost:3000/${user_id}/${taskId}/priority`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ task_priority: Number(newPriority) })
      });

      if (!response.ok) {
        throw new Error('Failed to update task priority');
      }

      setBoards(prev => {
        const updatedBoards = { ...prev };
        
        // Remove from original board
        updatedBoards[fromBoardId] = {
          ...updatedBoards[fromBoardId],
          tasks: updatedBoards[fromBoardId].tasks.filter(task => task._id !== taskId)
        };

        // Find the task and update its priority
        const movedTask = prev[fromBoardId].tasks.find(task => task._id === taskId);
        const updatedTask = { 
          ...movedTask, 
          task_priority: newPriority 
        };

        // Add to target board
        updatedBoards[toBoardId] = {
          ...updatedBoards[toBoardId],
          tasks: [...updatedBoards[toBoardId].tasks, updatedTask]
        };

        return updatedBoards;
      });

      toast.success('Task moved successfully');
    } catch (error) {
      console.error('Error updating task priority:', error);
      toast.error('Failed to update task status');
    }
  };

  // Handler for review board drops
  const handleReviewDrop = async (taskId, fromBoardId) => {
    try {
      const statusResponse = await fetch(`http://localhost:3000/${user_id}/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update task status');
      }

      setBoards(prev => {
        const updatedBoards = { ...prev };
        
        // Remove from original board
        updatedBoards[fromBoardId] = {
          ...updatedBoards[fromBoardId],
          tasks: updatedBoards[fromBoardId].tasks.filter(task => task._id !== taskId)
        };

        // Find the task and update its status
        const movedTask = prev[fromBoardId].tasks.find(task => task._id === taskId);
        const updatedTask = { 
          ...movedTask, 
          task_status: true 
        };

        // Add to review board
        updatedBoards.review = {
          ...updatedBoards.review,
          tasks: [...updatedBoards.review.tasks, updatedTask]
        };

        return updatedBoards;
      });

      // Open price modal
      const task = boards[fromBoardId].tasks.find(t => t._id === taskId);
      setCurrentTask(task);
      setTaskPrice(task.task_price || 0);
      setPriceDrawerOpen(true);
    } catch (error) {
      console.error('Error moving task to review:', error);
      toast.error('Failed to mark task as completed');
    }
  };

  // Unified drop handler
  const handleDrop = (e, targetBoardId) => {
    e.preventDefault();
    setDragOverBoardId(null);
    
    if (!draggedItem || draggedFromBoard === targetBoardId) return;

    if (targetBoardId === 'review') {
      handleReviewDrop(draggedItem._id, draggedFromBoard);
    } else {
      handleRegularDrop(draggedItem._id, draggedFromBoard, targetBoardId);
    }

    setDraggedItem(null);
    setDraggedFromBoard(null);
  };

  const handleDragStart = (e, task, boardId) => {
    setDraggedItem(task);
    setDraggedFromBoard(boardId);
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDraggedFromBoard(null);
    setDragOverBoardId(null);
  };

  const handleDragOver = (e, boardId) => {
    e.preventDefault();
    if (draggedFromBoard !== boardId) {
      setDragOverBoardId(boardId);
    }
  };

  const handleDragLeave = (e) => {
    setDragOverBoardId(null);
  };

  const handlePriceSubmit = async () => {
    if (!currentTask) return;

    try {
      const response = await fetch(`http://localhost:3000/${user_id}/${currentTask._id}/price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          task_price: parseFloat(taskPrice)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task price');
      }

      setBoards(prev => {
        const updatedBoards = { ...prev };
        const reviewBoard = updatedBoards.review;
        const taskIndex = reviewBoard.tasks.findIndex(t => t._id === currentTask._id);
        
        if (taskIndex !== -1) {
          reviewBoard.tasks[taskIndex].task_price = parseFloat(taskPrice);
        }
        
        return updatedBoards;
      });

      toast.success('Task price configured successfully!');
      setPriceDrawerOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error updating task price:', error);
      toast.error('Failed to configure task price');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return '';
    return `$${price.toLocaleString()}`;
  };

  // Stats calculations
  const totalTasksCount =
    boards.backlog.tasks.length +
    boards.todo.tasks.length +
    boards.inProgress.tasks.length +
    boards.review.tasks.length;

  const incompleteTasksCount =
    boards.backlog.tasks.length +
    boards.todo.tasks.length +
    boards.inProgress.tasks.length;

  const completedTasksCount = boards.review.tasks.length;

  const potentialRevenue = boards.review.tasks.reduce((sum, task) => {
    return sum + (task.task_price || 0);
  }, 0);

  // Client and Project select options
  const clientOptions = clients.map(client => ({
    value: client._id,
    label: client.client_name
  }));

  const projectOptions = projects.map(proj => ({
    value: proj.id || proj._id,
    label: proj.projectName || proj.project_name
  }));

  return (
    <PageTransition>
      <AppLayout>
        <PageContainer className="py-8">
          {/* Header */}
          <PageHeader
            title="My Workspace"
            subtitle="Organize tasks, map project timelines, and configure billing."
            action={
              <Button
                variant="primary"
                onClick={() => setShowTaskModal(true)}
                icon={Plus}
              >
                Add Task
              </Button>
            }
          />

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Tasks"
              value={totalTasksCount}
              icon={LayoutDashboard}
            />
            <StatCard
              title="Active Queue"
              value={incompleteTasksCount}
              icon={Clock}
            />
            <StatCard
              title="Completed / Under Review"
              value={completedTasksCount}
              icon={CheckCircle}
            />
            <StatCard
              title="Potential Revenue"
              value={`$${potentialRevenue.toLocaleString()}`}
              icon={DollarSign}
            />
          </div>

          {/* Kanban Board Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {Object.values(boards).map((board) => {
              const isOver = dragOverBoardId === board.id;
              
              return (
                <div
                  key={board.id}
                  onDragOver={(e) => handleDragOver(e, board.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, board.id)}
                  className={`
                    flex flex-col rounded-2xl border transition-all duration-200 min-h-[500px]
                    ${isOver 
                      ? 'bg-slate-800/40 border-violet-500/60 shadow-lg shadow-violet-500/5' 
                      : 'bg-slate-900/40 border-slate-800/80'
                    }
                  `}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${board.color}`} />
                      <h3 className="font-semibold text-slate-200 text-sm tracking-tight">
                        {board.title}
                      </h3>
                    </div>
                    <Badge variant={board.badgeColor} size="xs">
                      {board.tasks.length}
                    </Badge>
                  </div>

                  {/* Task List */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px] sf-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {board.tasks.length > 0 ? (
                        board.tasks.map((task) => (
                          <motion.div
                            key={task._id}
                            layoutId={task._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task, board.id)}
                            onDragEnd={handleDragEnd}
                            className="group cursor-grab active:cursor-grabbing"
                          >
                            <Card
                              variant="default"
                              hover={true}
                              className="p-4 bg-slate-900/50 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 transition-all duration-200"
                            >
                              <div className="space-y-3">
                                {/* Title */}
                                <h4 className="font-semibold text-sm text-slate-100 group-hover:text-violet-400 transition-colors line-clamp-2">
                                  {task.task_name}
                                </h4>

                                {/* Description */}
                                {task.task_description && (
                                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {task.task_description}
                                  </p>
                                )}

                                {/* Project & Client Info */}
                                <div className="space-y-1.5 pt-1">
                                  {task.task_project && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <Briefcase size={12} className="text-slate-500" />
                                      <span className="truncate">{task.task_project.project_name}</span>
                                    </div>
                                  )}
                                  {task.task_client && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <Users size={12} className="text-slate-500" />
                                      <span className="truncate">{task.task_client.client_name}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Bottom Info Row */}
                                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 flex-wrap">
                                  <Badge
                                    variant={priorityBadgeVariants[task.task_priority]}
                                    size="xs"
                                  >
                                    {priorityTextMapping[task.task_priority]}
                                  </Badge>

                                  {task.task_price > 0 && (
                                    <div className="text-xs font-semibold text-emerald-400">
                                      {formatPrice(task.task_price)}
                                    </div>
                                  )}

                                  {task.task_commissioned && (
                                    <div className={`flex items-center gap-1 text-[10px] ${
                                      isOverdue(task.task_commissioned)
                                        ? 'text-red-400 font-medium'
                                        : 'text-slate-500'
                                    }`}>
                                      <Calendar size={10} />
                                      <span>{formatDate(task.task_commissioned)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-slate-800/80 text-center">
                          <AlertCircle size={20} className="text-slate-600 mb-1.5" />
                          <span className="text-xs font-medium text-slate-500">No tasks in column</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>

        {/* Set Task Price Modal */}
        <Modal
          isOpen={priceDrawerOpen}
          onClose={() => setPriceDrawerOpen(false)}
          title="Configure Task Billable Rate"
          maxWidth="max-w-md"
        >
          <div className="space-y-5">
            {currentTask && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Completed Task
                </span>
                <p className="text-sm font-medium text-slate-200 mt-1 line-clamp-2 leading-relaxed">
                  {currentTask.task_name}
                </p>
              </div>
            )}

            <div>
              <Input
                label="Billable Rate / Task Price ($)"
                placeholder="0.00"
                type="number"
                value={taskPrice}
                onChange={(e) => setTaskPrice(e.target.value)}
                icon={DollarSign}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Set the price you will invoice for this task. Set to 0 if it is part of a fixed-price package.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setPriceDrawerOpen(false)}
                fullWidth
              >
                Skip / Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePriceSubmit}
                fullWidth
              >
                Confirm Rate
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Task Modal */}
        <Modal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          title="Create New Task"
          maxWidth="max-w-md"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setAddingTask(true);
              const body = {
                task_name: taskName,
                task_description: taskDesc,
                task_priority: taskPriority,
                task_type: 1 // Company / Professional
              };
              
              try {
                const response = await fetch(`http://localhost:3000/${user_id}/${selectedClient}/addtask`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    ...body,
                    project_id: selectedProject
                  })
                });

                setAddingTask(false);
                if (response.status === 201) {
                  setShowTaskModal(false);
                  setTaskName('');
                  setTaskDesc('');
                  setTaskPriority(3);
                  setSelectedClient('');
                  setSelectedProject('');
                  toast.success('Task added successfully', { toastId: 'task-success' });
                } else {
                  const err = await response.json();
                  toast.error(`Failed to add task: ${err.message}`);
                }
              } catch (error) {
                console.error(error);
                setAddingTask(false);
                toast.error('Failed to create task');
              }
            }}
            className="space-y-4"
          >
            <Select
              label="Select Client"
              required
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedProject('');
              }}
              options={clientOptions}
              placeholder="Choose a client..."
              icon={Users}
            />

            <Select
              label="Select Project"
              required
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={!selectedClient || loadingProjects}
              options={projectOptions}
              placeholder={
                loadingProjects
                  ? 'Loading active projects...'
                  : selectedClient
                  ? 'Choose a project...'
                  : 'Choose a client first'
              }
              icon={Briefcase}
            />

            <Input
              label="Task Name"
              placeholder="e.g. Implement OAuth Flow"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <Textarea
              label="Task Description"
              placeholder="Describe the scope of this task..."
              required
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={3}
            />

            <Select
              label="Task Status / Priority Column"
              required
              value={taskPriority}
              onChange={(e) => setTaskPriority(Number(e.target.value))}
              options={[
                { value: 3, label: 'Backlog' },
                { value: 2, label: 'To Do' },
                { value: 1, label: 'In Progress' }
              ]}
              placeholder=""
            />

            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowTaskModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={addingTask}
                fullWidth
              >
                Create Task
              </Button>
            </div>
          </form>
        </Modal>
      </AppLayout>
    </PageTransition>
  );
};

export default Dashboard;