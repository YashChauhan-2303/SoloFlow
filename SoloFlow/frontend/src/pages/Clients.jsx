import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ClientCard from '../components/ClientCard';
import { AppLayout, PageContainer, PageHeader, PageGrid } from '../components/layouts';
import { Input, Textarea, Modal, Button, EmptyState, Skeleton } from '../components/ui';
import { getApiUrl } from '../utils/api';

function Clients() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Core state
  const [data, setData] = useState({ clients: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');

  // Fetch clients from the backend API
  const fetchClients = async () => {
    try {
      const response = await fetch(getApiUrl(`${user_id}/clients`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const clientsData = await response.json();
      setData(clientsData);
    } catch (err) {
      toast.error(err.message || 'Error fetching client list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchClients();
  }, [user_id, token]);

  // Handle client creation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const client = {
      client_name: name,
      client_email: email,
      client_company: company,
      client_address: address,
      client_user: user_id,
    };

    try {
      const response = await fetch(getApiUrl(`${user_id}/addclient`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(client),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add client');
      }

      toast.success(res.message || 'Client added successfully');
      setShowForm(false);
      
      // Clear form states
      setEmail('');
      setName('');
      setCompany('');
      setAddress('');

      // Refresh list
      fetchClients();
    } catch (err) {
      toast.error(err.message || 'An error occurred while adding the client');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle client deletion
  const handleDelete = async (client_id) => {
    try {
      const response = await fetch(getApiUrl(`${user_id}/${client_id}/deleteclient`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to delete client');
      }

      toast.success(res.message || 'Client deleted successfully');
      
      // Optimistically update the UI list
      setData((prev) => ({
        ...prev,
        clients: prev.clients.filter((c) => c._id !== client_id),
      }));
    } catch (err) {
      toast.error(err.message || 'Could not delete the client');
    }
  };

  // Filter clients by search query
  const filteredClients = (data.clients || []).filter((client) =>
    client.client_name?.toLowerCase().includes(search.trim().toLowerCase()) ||
    client.client_company?.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <AppLayout>
      <PageContainer className="py-10">
        {/* Modernized Header with Breadcrumbs & Add Action */}
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => navigate(`/${user_id}/dashboard`) },
            { label: 'Clients' },
          ]}
          title="Client Directory"
          subtitle={`Manage your relationships and view ${data.clients?.length || 0} active project partner${data.clients?.length !== 1 ? 's' : ''}.`}
          gradientTitle
          icon={Users}
          action={
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setShowForm(true)}
              className="shadow-lg shadow-violet-500/20 font-semibold"
            >
              Add Client
            </Button>
          }
        />

        {/* Premium Search input widget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search clients by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111119]/80 border border-white/[0.06] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:bg-[#151522]/90 focus:ring-1 focus:ring-violet-500/30 transition-all duration-300 shadow-inner"
            />
          </div>
        </motion.div>

        {/* Main Content Area */}
        {loading ? (
          // Skeletons during data fetching
          <PageGrid cols={3} gap="gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#111119]/50 border border-white/[0.05] rounded-2xl p-6 h-[220px] flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <Skeleton width="w-12" height="h-12" rounded="rounded-full" />
                  <div className="flex-1 space-y-2 mt-1">
                    <Skeleton width="w-3/4" height="h-4" />
                    <Skeleton width="w-1/2" height="h-3" />
                  </div>
                </div>
                <div className="space-y-2 my-4">
                  <Skeleton width="w-5/6" height="h-3" />
                  <Skeleton width="w-2/3" height="h-3" />
                </div>
                <Skeleton width="w-full" height="h-9" rounded="rounded-xl" />
              </div>
            ))}
          </PageGrid>
        ) : filteredClients.length > 0 ? (
          // Grid layout of clients
          <PageGrid cols={3} gap="gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client) => (
                <motion.div
                  key={client._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <ClientCard
                    client={{
                      user_id: user_id,
                      client_id: client._id,
                      name: client.client_name,
                      email: client.client_email,
                      phone: client.client_phone,
                      company: client.client_company,
                      address: client.client_address,
                    }}
                    onDelete={() => handleDelete(client._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </PageGrid>
        ) : (
          // Empty State representation
          <EmptyState
            icon={search.trim() ? AlertCircle : Users}
            title={search.trim() ? 'No clients matched your search' : 'No clients directory'}
            description={
              search.trim()
                ? 'Check for spelling typos or try searching with another name or company identifier.'
                : 'Form a client partner relationship to begin starting and monitoring active projects.'
            }
            action={
              !search.trim() && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowForm(true)}
                  className="font-semibold"
                >
                  Add Your First Client
                </Button>
              )
            }
          />
        )}

        {/* Elegant Minimal Footer */}
        <footer className="py-12 mt-12 text-center text-xs text-slate-600 border-t border-white/[0.03]">
          © 2026 SoloFlow. All rights reserved. Powered by premium management frameworks.
        </footer>

        {/* Modal form overlay for client addition */}
        <Modal
          isOpen={showForm}
          onClose={() => !isSubmitting && setShowForm(false)}
          title="Add New Client"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Client Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Client Email Address"
              type="email"
              placeholder="e.g. john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Client Company"
              placeholder="e.g. Acme Corporation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Textarea
              label="Client Address"
              placeholder="e.g. 123 Enterprise Way, Suite 400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.05]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Create Client
              </Button>
            </div>
          </form>
        </Modal>
      </PageContainer>
    </AppLayout>
  );
}

export default Clients;