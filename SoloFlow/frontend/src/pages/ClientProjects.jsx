import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Briefcase, Plus, Search, Clock, Calendar, AlertCircle } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { AppLayout, PageContainer, PageHeader, PageGrid } from '../components/layouts';
import { Input, Textarea, Modal, Button, EmptyState, Skeleton } from '../components/ui';

function ClientProjects() {
  const { user_id, client_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Core State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [sortByDeadline, setSortByDeadline] = useState(false);

  // Form State
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Fetch client projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/${user_id}/${client_id}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to load project details');
        }
        const result = await response.json();
        const projectsData = Array.isArray(result) ? result : result.projects || [];
        setProjects(projectsData);
      } catch (err) {
        toast.error(err.message || 'Error loading client projects list');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user_id, client_id, token, refresh]);

  // Project creation submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const project = {
      project_name: projectName,
      deadline: projectDeadline,
      project_description: projectDescription,
    };

    try {
      const response = await fetch(`http://localhost:3000/${user_id}/${client_id}/addproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });

      const res = await response.json();

      if (response.status === 201) {
        toast.success(res.message || 'Project created successfully!');
        setShowProjectForm(false);
        setProjectDeadline('');
        setProjectName('');
        setProjectDescription('');
        setRefresh((r) => !r);
        return;
      }
      throw new Error(res.message || 'Could not register new project scope');
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/${projectId}/deleteproject`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (response.status === 200) {
        toast.success(res.message || 'Project deleted successfully');
        setProjects((prev) => prev.filter((p) => p.id !== projectId && p._id !== projectId));
      } else {
        throw new Error(res.message || 'Failed to delete project');
      }
    } catch (err) {
      toast.error(err.message || 'Could not delete project');
    }
  };

  // Filter & sorting pipeline
  let filteredProjects = [...projects];
  if (search.trim()) {
    filteredProjects = filteredProjects.filter((project) =>
      (project.projectName || '')
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );
  }
  if (sortByDeadline) {
    filteredProjects.sort((a, b) => {
      const dateA = new Date(a.deadline || a.project_deadline || 0);
      const dateB = new Date(b.deadline || b.project_deadline || 0);
      if (!a.deadline && !a.project_deadline && !b.deadline && !b.project_deadline) return 0;
      if (!a.deadline && !a.project_deadline) return 1;
      if (!b.deadline && !b.project_deadline) return -1;
      return dateA - dateB;
    });
  }

  return (
    <AppLayout>
      <PageContainer className="py-10">
        
        {/* Page Header with Actions & Navigation context */}
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => navigate(`/${user_id}/dashboard`) },
            { label: 'Clients', onClick: () => navigate(`/${user_id}/clients`) },
            { label: 'Projects' },
          ]}
          title="Client Projects"
          subtitle="Administer deliverables, schedule calendar milestones, and process billing invoices."
          gradientTitle
          icon={Briefcase}
          action={
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setShowProjectForm(true)}
              className="shadow-lg shadow-violet-500/20 font-semibold"
            >
              Add Project
            </Button>
          }
        />

        {/* Filter and Control Operations row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
        >
          {/* Search bar widget */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search project by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111119]/80 border border-white/[0.06] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:bg-[#151522]/90 focus:ring-1 focus:ring-violet-500/30 transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Toggle sort deadline */}
          <Button
            variant={sortByDeadline ? 'primary' : 'secondary'}
            size="md"
            icon={Clock}
            onClick={() => setSortByDeadline((prev) => !prev)}
            className={`font-semibold transition-all duration-300 ${
              sortByDeadline 
                ? 'shadow-md shadow-violet-500/10' 
                : 'hover:border-violet-500/20'
            }`}
          >
            {sortByDeadline ? 'Sorted by Deadline' : 'Sort by Deadline'}
          </Button>
        </motion.div>

        {/* Dynamic Project Grid Render */}
        {loading ? (
          // Standard Loading Skeletons
          <PageGrid cols={3} gap="gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#111119]/50 border border-white/[0.05] rounded-2xl p-6 h-[240px] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Skeleton width="w-2/3" height="h-5" />
                  <Skeleton width="w-full" height="h-3" />
                  <Skeleton width="w-5/6" height="h-3" />
                </div>
                <div className="flex items-center justify-between gap-4 mt-6">
                  <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
                  <Skeleton width="w-24" height="h-4" />
                </div>
                <Skeleton width="w-full" height="h-9" rounded="rounded-xl" className="mt-4" />
              </div>
            ))}
          </PageGrid>
        ) : filteredProjects.length > 0 ? (
          // Grid mapping clients projects
          <PageGrid cols={3} gap="gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.project_id || project.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProjectCard
                    project={{
                      projectName: project.projectName,
                      user_id: user_id,
                      client_id: client_id,
                      project_id: project.id || project._id,
                      clientName: project.clientName,
                      clientCompany: project.clientCompany,
                      projectDescription: project.projectDescription,
                      status: project.status || 'incomplete',
                      deadline: project.deadline || project.project_deadline,
                      invoiceGenerated: project.invoiceGenerated || false,
                    }}
                    onDelete={() => handleDeleteProject(project.id || project._id || project.project_id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </PageGrid>
        ) : (
          // Empty state placeholder
          <EmptyState
            icon={search.trim() ? AlertCircle : Briefcase}
            title={search.trim() ? 'No projects match your criteria' : 'No projects registered'}
            description={
              search.trim()
                ? 'Adjust your spelling inputs or search keywords to locate this client workflow.'
                : 'Define project scope descriptions and target dates to start billing this client partner.'
            }
            action={
              !search.trim() && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowProjectForm(true)}
                  className="font-semibold"
                >
                  Create Client Project
                </Button>
              )
            }
          />
        )}

        {/* Elegant Minimal Footer */}
        <footer className="py-12 mt-12 text-center text-xs text-slate-600 border-t border-white/[0.03]">
          © 2026 SoloFlow. All rights reserved. Powered by premium management frameworks.
        </footer>

        {/* Add Project Form Modal overlay */}
        <Modal
          isOpen={showProjectForm}
          onClose={() => !isSubmitting && setShowProjectForm(false)}
          title="Add Client Project"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Project Title"
              placeholder="e.g. Website Design Refactor"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Textarea
              label="Project Scope / Description"
              placeholder="Detail the deliverable specifications, code refactors, or graphics design expectations..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
            />

            <Input
              label="Target Deadline"
              type="date"
              value={projectDeadline}
              onChange={(e) => setProjectDeadline(e.target.value)}
              required
              disabled={isSubmitting}
              icon={Calendar}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.05]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowProjectForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Add Project
              </Button>
            </div>
          </form>
        </Modal>

      </PageContainer>
    </AppLayout>
  );
}

export default ClientProjects;