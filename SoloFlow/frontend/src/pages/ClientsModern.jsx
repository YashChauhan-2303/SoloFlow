import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import NavbarModern from '../components/NavbarModern';
import PageTransition from '../components/PageTransition';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { PageContainer, PageHeader, PageGrid } from '../components/layouts';
import { useTheme } from '../contexts/ThemeContext';

const ClientsModern = () => {
  const { user_id } = useParams();
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${user_id}/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          toast.error('Failed to load clients');
          return;
        }

        const data = await response.json();
        setClients(data.clients || []);
        setFilteredClients(data.clients || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [user_id, token]);

  // Handle search
  useEffect(() => {
    const filtered = clients.filter(client =>
      (client.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.client_email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-purple-500 to-blue-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-pink-500 to-rose-500',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const ClientCard = ({ client }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="elevated" className="group cursor-pointer">
        {/* Client Avatar & Name */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getAvatarColor(client.client_name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:shadow-glow-purple transition-smooth`}
            whileHover={{ scale: 1.1 }}
          >
            {getInitials(client.client_name)}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">
              {client.client_name}
            </h3>
            {client.client_industry && (
              <p className="text-xs text-slate-400">{client.client_industry}</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 pb-4 border-b border-slate-700/50">
          {client.client_email && (
            <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-smooth">
              <Mail size={14} />
              <span className="truncate">{client.client_email}</span>
            </div>
          )}
          {client.client_phone && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone size={14} />
              <span>{client.client_phone}</span>
            </div>
          )}
          {client.client_address && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={14} />
              <span className="truncate">{client.client_address}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Projects', value: client.projects_count || 0 },
            { label: 'Total Revenue', value: `$${(client.total_revenue || 0).toLocaleString()}` },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-2">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-sm font-bold text-slate-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant={client.client_status === 'active' ? 'success' : 'default'}
            size="sm"
          >
            {client.client_status || 'Active'}
          </Badge>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="text-slate-500 hover:text-slate-300 transition-smooth"
          >
            →
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <PageTransition>
      <NavbarModern />
      <PageContainer className="py-8">
        {/* Page Header */}
        <PageHeader
          title="Clients"
          subtitle={`Manage ${clients.length} client${clients.length !== 1 ? 's' : ''}`}
          action={
            <Button variant="primary" size="lg">
              <Plus size={18} />
              Add Client
            </Button>
          }
        />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:bg-slate-800 transition-smooth"
            />
          </div>
        </motion.div>

        {/* Client Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-56 rounded-xl bg-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <PageGrid cols={3} gap="gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client) => (
                <ClientCard key={client.client_id} client={client} />
              ))}
            </AnimatePresence>
          </PageGrid>
        ) : (
          <EmptyState
            icon={Plus}
            title={searchTerm ? 'No clients found' : 'No clients yet'}
            description={searchTerm ? 'Try adjusting your search terms' : 'Create your first client to get started'}
            action={
              !searchTerm && (
                <Button variant="primary">
                  <Plus size={18} />
                  Add First Client
                </Button>
              )
            }
          />
        )}
      </PageContainer>
    </PageTransition>
  );
};

export default ClientsModern;
