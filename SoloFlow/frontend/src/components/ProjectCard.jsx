import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Eye, FileText, Trash2, User, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from './ui';
import { getApiUrl } from '../utils/api';

function ProjectCard({ 
  project = {
    projectName: '',
    projectDescription: '',
    clientName: '',
    clientCompany: '',
    status: false, // boolean status (true = completed, false = incomplete)
    deadline: '',
    user_id: '',
    client_id: '',
    project_id: '',
    invoiceGenerated: false,
  },
  onDelete
}) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [invoiceGenerated, setInvoiceGenerated] = useState(project.invoiceGenerated || false);
  const [loading, setLoading] = useState(false);

  // Determine current status
  const isCompleted = project.status === true || project.status === 'completed';
  const statusText = isCompleted ? 'Completed' : 'Active';

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.stopPropagation();
    if (!isCompleted || invoiceGenerated) return;
    setLoading(true);
    
    if (!token) {
      toast.error('You must be logged in to generate an invoice');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        getApiUrl(`${project.user_id}/${project.client_id}/${project.project_id}/addinvoice`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate invoice');
      }

      toast.success('Invoice generated successfully!');
      setInvoiceGenerated(true);
    } catch (error) {
      toast.error(error.message || 'Error generating invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (e) => {
    e.stopPropagation();
    if (!project.user_id || !project.client_id || !project.project_id) {
      toast.error('Missing required information to view invoice');
      return;
    }
    navigate(`/${project.user_id}/${project.client_id}/${project.project_id}/viewinvoice`);
  };

  return (
    <Card 
      variant="default"
      className="group relative flex flex-col justify-between h-full bg-[#111119]/60 hover:bg-[#151522]/80 border border-white/[0.05] hover:border-violet-500/30 shadow-xl overflow-hidden transition-all duration-300 rounded-2xl p-6"
    >
      {/* Decorative top indicator bar */}
      <div 
        className={`absolute top-0 left-0 w-full h-[3px] transition-colors duration-300 ${
          isCompleted ? 'bg-emerald-500' : 'bg-violet-500'
        }`} 
      />

      {/* Decorative visual glow orb inside the card */}
      <div 
        className={`absolute top-0 right-0 w-[120px] h-[120px] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isCompleted ? 'bg-emerald-500/10' : 'bg-violet-500/10'
        }`} 
      />

      <div>
        {/* Project Header Title & Delete Button */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h4 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-200 truncate">
              {project.projectName || 'Untitled Project'}
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {project.projectDescription || 'No project scope details available.'}
            </p>
          </div>

          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-red-400 border border-white/[0.05] hover:border-red-500/20 shadow-sm transition-all duration-200 flex-shrink-0"
              title="Delete Project"
            >
              <Trash2 size={15} />
            </motion.button>
          )}
        </div>

        {/* Client details details */}
        <div className="mt-5 space-y-2 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <User size={13} className="text-slate-500" />
            <span className="truncate">{project.clientName || 'Unknown Partner'}</span>
          </div>
          {project.clientCompany && (
            <div className="flex items-center gap-2">
              <Briefcase size={13} className="text-slate-500" />
              <span className="truncate">{project.clientCompany}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Area: Badges & Deadlines */}
      <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge 
            variant={isCompleted ? 'success' : 'primary'} 
            size="sm"
          >
            {statusText}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Calendar size={13} className="text-slate-500" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        </div>

        {/* Invoice Generator Action Trigger */}
        {isCompleted ? (
          invoiceGenerated ? (
            <Button
              onClick={handleViewInvoice}
              variant="secondary"
              fullWidth
              size="sm"
              icon={Eye}
              className="font-semibold !border-emerald-500/30 !text-emerald-400 hover:!bg-emerald-500/10 hover:!border-emerald-500/50"
            >
              View Invoice
            </Button>
          ) : (
            <Button
              onClick={handleGenerateInvoice}
              variant="primary"
              fullWidth
              size="sm"
              isLoading={loading}
              icon={FileText}
              className="font-semibold shadow-lg shadow-violet-500/15"
            >
              Generate Invoice
            </Button>
          )
        ) : (
          <Button
            variant="secondary"
            fullWidth
            size="sm"
            disabled
            icon={FileText}
            className="opacity-50 !cursor-not-allowed font-semibold"
          >
            Generate Invoice
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ProjectCard;