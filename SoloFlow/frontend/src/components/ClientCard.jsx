import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Building2, Trash2, ArrowRight } from 'lucide-react';
import { Card, Avatar, Button } from './ui';

function ClientCard({ 
  client = {
    user_id: '1',
    client_id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'Creative Solutions Inc.',
    address: '123 Business Ave, New York',
  },
  onDelete
}) {
  const navigate = useNavigate();

  const handleViewProjects = (e) => {
    e.stopPropagation(); // Avoid triggering card click if any
    navigate(`/${client.user_id}/${client.client_id}/projects`);
  };

  return (
    <Card 
      variant="default" 
      className="group relative flex flex-col justify-between h-full bg-[#111119]/60 hover:bg-[#151522]/80 border border-white/[0.05] hover:border-violet-500/30 shadow-xl overflow-hidden transition-all duration-300 rounded-2xl"
    >
      {/* Visual background ambient hover glow inside the card */}
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Client Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Avatar 
              name={client.name} 
              size="lg" 
              className="ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all duration-300"
            />
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-200 truncate">
                {client.name}
              </h3>
              {client.company && (
                <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors duration-200">
                  <Building2 size={12} className="flex-shrink-0" />
                  <span className="truncate">{client.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delete Action Button */}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(client.client_id);
              }}
              className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-red-400 border border-white/[0.05] hover:border-red-500/20 shadow-sm transition-all duration-200"
              title="Delete Client"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>

        {/* Contact Info list */}
        <div className="space-y-2.5 text-sm font-medium text-slate-400">
          {client.email && (
            <div className="flex items-center gap-2.5 group/info hover:text-slate-300 transition-colors duration-150">
              <Mail size={15} className="text-slate-500 group-hover/info:text-violet-400 transition-colors duration-150 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2.5 group/info hover:text-slate-300 transition-colors duration-150">
              <MapPin size={15} className="text-slate-500 group-hover/info:text-indigo-400 transition-colors duration-150 flex-shrink-0" />
              <span className="truncate">{client.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* View Projects CTA */}
      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <Button
          onClick={handleViewProjects}
          variant="primary"
          fullWidth
          size="md"
          className="relative overflow-hidden group/btn font-semibold"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Projects
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
        </Button>
      </div>
    </Card>
  );
}

export default ClientCard;