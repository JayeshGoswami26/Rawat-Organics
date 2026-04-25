import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mail, Phone, Calendar, X, Loader2,
} from 'lucide-react';
import { inquiryApi } from '@/lib/api';
import { toast } from 'sonner';

interface Inquiry {
  _id: string; name: string; email: string; phone?: string;
  company?: string; message: string; inquiryType: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  adminNotes?: string; createdAt: string;
}

const ITEMS_PER_PAGE = 6;

const STATUS_COLORS: Record<string, string> = {
  new:      'bg-yellow-100 text-yellow-800',
  read:     'bg-blue-100 text-blue-800',
  replied:  'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

const STATUS_ICONS: Record<string, string> = {
  new:      '⏳',
  read:     '👁️',
  replied:  '✓',
  archived: '📦',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries]       = useState<Inquiry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [selected, setSelected]         = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes]     = useState('');
  const [newStatus, setNewStatus]       = useState<Inquiry['status']>('new');
  const [submitting, setSubmitting]     = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const { data } = await inquiryApi.getAll();
      const result = data.data?.inquiries ?? data.data ?? data;
      setInquiries(Array.isArray(result) ? result : []);
    } catch { toast.error('Failed to fetch inquiries'); setInquiries([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const openDetail = (inq: Inquiry) => {
    setSelected(inq);
    setAdminNotes(inq.adminNotes ?? '');
    setNewStatus(inq.status);
  };

  const handleStatusChange = async (status: Inquiry['status']) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await inquiryApi.updateStatus(selected._id, status, adminNotes);
      setSelected({ ...selected, status, adminNotes });
      setNewStatus(status);
      toast.success(`Status updated to ${status}`);
      fetchInquiries();
    } catch { toast.error('Failed to update status'); }
    finally  { setSubmitting(false); }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await inquiryApi.updateStatus(selected._id, newStatus, adminNotes);
      toast.success('Notes saved');
      setSelected({ ...selected, adminNotes, status: newStatus });
      fetchInquiries();
    } catch { toast.error('Failed to save notes'); }
    finally  { setSubmitting(false); }
  };

  const filtered = useMemo(() =>
    inquiries.filter((inq) =>
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase())
    ), [inquiries, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Page header */}
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-800">Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </motion.div>

        {/* Inquiry list */}
        <motion.div
          className="space-y-3"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {paginated.map((inq) => (
            <motion.div
              key={inq._id}
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              onClick={() => openDetail(inq)}
              className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-primary/30 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">{inq.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[inq.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_ICONS[inq.status]} {inq.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {inq.inquiryType}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{inq.message}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <motion.div
                      whileHover={{ textDecoration: 'underline' }}
                      className="flex items-center gap-1.5 hover:text-primary cursor-pointer"
                    >
                      <Mail size={16} />{inq.email}
                    </motion.div>
                    {inq.phone && (
                      <motion.div
                        whileHover={{ textDecoration: 'underline' }}
                        className="flex items-center gap-1.5 hover:text-primary cursor-pointer"
                      >
                        <Phone size={16} />{inq.phone}
                      </motion.div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.2 }} className="text-2xl ml-4 text-gray-400">
                  →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {paginated.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg">{search ? 'No inquiries found' : 'No inquiries yet'}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-800 border border-gray-200 hover:border-primary'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selected.name}</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="font-medium text-gray-800">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <motion.p
                        whileHover={{ color: '#1a4d2e' }}
                        className="font-medium text-blue-600 cursor-pointer"
                      >
                        {selected.email}
                      </motion.p>
                    </div>
                    {selected.phone && (
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="font-medium text-gray-800">{selected.phone}</p>
                      </div>
                    )}
                    {selected.company && (
                      <div>
                        <p className="text-gray-600 text-sm">Company</p>
                        <p className="font-medium text-gray-800">{selected.company}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 text-sm">Type</p>
                      <p className="font-medium text-gray-800 capitalize">{selected.inquiryType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Message</h3>
                  <p className="text-gray-600 leading-relaxed p-4 bg-gray-50 rounded-lg">
                    {selected.message}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['new', 'read', 'replied', 'archived'] as const).map((status) => (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={submitting}
                        onClick={() => handleStatusChange(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize disabled:opacity-50 ${
                          selected.status === status
                            ? STATUS_COLORS[status]
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {STATUS_ICONS[status]} {status}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Admin Notes</h3>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private notes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveNotes}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Notes'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(null)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 transition-all"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
