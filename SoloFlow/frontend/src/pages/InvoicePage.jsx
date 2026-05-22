import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FileText, Send, ArrowLeft, Mail, Calendar, User, Building, Receipt } from 'lucide-react';
import { AppLayout, PageContainer, PageHeader } from '../components/layouts';
import { Card, Button, Skeleton } from '../components/ui';

function InvoicePage() {
  const { user_id, client_id, project_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Core State
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch invoice details
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/${user_id}/${client_id}/${project_id}/viewinvoice`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load invoice data');
        return res.json();
      })
      .then((data) => {
        // Backend compatibility checks: handle nested invoices array or raw invoice object
        if (data.invoices && Array.isArray(data.invoices) && data.invoices.length > 0) {
          setInvoiceData(data.invoices[0]);
        } else if (data.invoice) {
          setInvoiceData(data.invoice);
        } else {
          setInvoiceData(data);
        }
      })
      .catch((err) => {
        toast.error(err.message || 'Error occurred while loading invoice details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, client_id, project_id, token]);

  // Handle invoice email dispatch
  const handleSendInvoice = async () => {
    if (!invoiceData?._id) {
      toast.error('Invoice identifier not found!');
      return;
    }
    setIsSending(true);

    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/${invoiceData._id}/email`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success('Invoice successfully dispatched to client email!');
      } else {
        throw new Error(data.message || 'Could not send email.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch invoice via email.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <PageContainer narrow className="py-10 flex flex-col gap-6">
          <div className="h-10 bg-slate-800/30 rounded-xl animate-pulse w-1/4 mb-4" />
          <Card variant="default" className="bg-[#111119]/50 border border-white/[0.05] p-6 h-[400px]">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <Skeleton width="w-48" height="h-5" />
                <Skeleton width="w-32" height="h-3.5" />
              </div>
              <Skeleton width="w-24" height="h-6" />
            </div>
            <div className="space-y-4 my-8">
              <Skeleton width="w-full" height="h-10" />
              <Skeleton width="w-full" height="h-10" />
              <Skeleton width="w-full" height="h-10" />
            </div>
            <div className="flex justify-end pt-4 border-t border-white/[0.04]">
              <Skeleton width="w-32" height="h-8" />
            </div>
          </Card>
        </PageContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageContainer narrow className="py-10">
        
        {/* Page Header and Breadcrumbs */}
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => navigate(`/${user_id}/dashboard`) },
            { label: 'Projects', onClick: () => navigate(`/${user_id}/${client_id}/projects`) },
            { label: 'Invoice' },
          ]}
          title="Project Invoice"
          subtitle={
            invoiceData?.invoice_number 
              ? `Invoice record reference #${invoiceData.invoice_number}` 
              : 'Detailed invoice particulars and payment statements.'
          }
          gradientTitle
          icon={Receipt}
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Main Invoice Card */}
          <Card 
            variant="default" 
            className="bg-[#111119]/60 border border-white/[0.05] shadow-2xl rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Ambient accent top bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-violet-600 to-indigo-600" />

            {/* Billed header metadata */}
            <div className="pb-6 mb-6 border-b border-white/[0.04] flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  {invoiceData?.invoice_project_id?.project_name || 'Deliverable Project'}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-slate-400">
                  <Calendar size={13} className="text-slate-500" />
                  <span>
                    Issued: {invoiceData?.invoice_date ? new Date(invoiceData.invoice_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs uppercase font-bold text-violet-400 tracking-wider">
                  Invoice Code
                </span>
                <p className="text-lg font-bold text-slate-200 mt-0.5">
                  #{invoiceData?.invoice_number || '0000'}
                </p>
              </div>
            </div>

            {/* Billing Entities split column details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-white/[0.04]">
              {/* Billed To */}
              <div className="p-4 bg-[#0a0a0f]/40 border border-white/[0.03] rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Billed To
                </span>
                <div className="mt-3 space-y-1.5 text-sm font-semibold text-slate-300">
                  <div className="flex items-center gap-2 text-slate-100 font-bold">
                    <User size={14} className="text-slate-500" />
                    <span>{invoiceData?.invoice_client_id?.client_name || 'Client Contact'}</span>
                  </div>
                  {invoiceData?.invoice_client_id?.client_company && (
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-slate-500" />
                      <span>{invoiceData.invoice_client_id.client_company}</span>
                    </div>
                  )}
                  {invoiceData?.invoice_client_id?.client_email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-500" />
                      <span className="text-slate-400 font-normal">{invoiceData.invoice_client_id.client_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billed From */}
              <div className="p-4 bg-[#0a0a0f]/40 border border-white/[0.03] rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Billed From
                </span>
                <div className="mt-3 space-y-1.5 text-sm font-semibold text-slate-300">
                  <div className="flex items-center gap-2 text-slate-100 font-bold">
                    <User size={14} className="text-slate-500" />
                    <span>{invoiceData?.invoice_user_id?.user_name || 'Freelance Agent'}</span>
                  </div>
                  {invoiceData?.invoice_user_id?.user_company && (
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-slate-500" />
                      <span>{invoiceData.invoice_user_id.user_company}</span>
                    </div>
                  )}
                  {invoiceData?.invoice_user_id?.user_email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-500" />
                      <span className="text-slate-400 font-normal">{invoiceData.invoice_user_id.user_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line items billing ledger table */}
            <div className="overflow-hidden border border-white/[0.04] rounded-xl bg-[#0a0a0f]/30">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.04] text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 text-left font-semibold">Line Items Particulars</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Amount Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-sm">
                  {invoiceData?.particulars?.length > 0 ? (
                    invoiceData.particulars.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors duration-150">
                        <td className="py-4 px-4 text-slate-200 font-semibold">
                          {item.task_name || 'Deliverable Task'}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-100 font-bold">
                          ${item.task_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-6 px-4 text-slate-500 text-center" colSpan={2}>
                        No specific item ledger items mapped.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Invoicing summary and final totals */}
            <div className="mt-6 pt-5 border-t border-white/[0.04] flex justify-end">
              <div className="w-full sm:max-w-xs p-4 bg-[#0a0a0f]/60 border border-white/[0.03] rounded-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Grand Total</span>
                  <span className="text-xl font-extrabold text-white">
                    ${invoiceData?.invoice_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Invoice Actions bar */}
            <div className="mt-8 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row justify-end items-center gap-3">
              <Button
                onClick={() => navigate(`/${user_id}/${client_id}/projects`)}
                variant="secondary"
                size="md"
                icon={ArrowLeft}
                className="w-full sm:w-auto font-semibold"
              >
                Back to Projects
              </Button>

              <Button
                onClick={handleSendInvoice}
                variant="primary"
                size="md"
                isLoading={isSending}
                icon={Send}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-violet-500/15"
              >
                Email Invoice to Client
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Elegant Minimal Footer */}
        <footer className="py-12 mt-12 text-center text-xs text-slate-600 border-t border-white/[0.03]">
          © 2026 SoloFlow. All rights reserved. Powered by premium management frameworks.
        </footer>
      </PageContainer>
    </AppLayout>
  );
}

export default InvoicePage;