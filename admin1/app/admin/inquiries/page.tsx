'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { inquiries as initialInquiries } from '@/lib/dummy-data';
import { Search, Mail, Phone, Calendar, X } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 6;

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState<'pending' | 'in-progress' | 'resolved'>(
    selectedInquiry?.status || 'pending'
  );

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(
      (inquiry) =>
        inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inquiries, searchQuery]);

  const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    toast.loading(`Updating status to ${status}...`);

    setTimeout(() => {
      setInquiries(
        inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      toast.success('Status updated successfully!');
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔄';
      case 'resolved':
        return '✓';
      default:
        return '•';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="pt-24 pb-8 px-8 bg-gray-50 min-h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <h1 className="text-3xl font-bold text-gray-800">Inquiries</h1>
                <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              {/* Inquiries List */}
              <motion.div
                className="space-y-3"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {paginatedInquiries.map((inquiry, index) => (
                  <motion.div
                    key={inquiry.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-primary/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{inquiry.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {getStatusIcon(inquiry.status)} {inquiry.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">{inquiry.subject}</p>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{inquiry.message}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <motion.div
                            whileHover={{ textDecoration: 'underline' }}
                            className="flex items-center gap-1.5 cursor-pointer hover:text-primary"
                          >
                            <Mail size={16} />
                            {inquiry.email}
                          </motion.div>
                          <motion.div
                            whileHover={{ textDecoration: 'underline' }}
                            className="flex items-center gap-1.5 cursor-pointer hover:text-primary"
                          >
                            <Phone size={16} />
                            {inquiry.phone}
                          </motion.div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="text-2xl ml-4"
                      >
                        →
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center gap-2"
                >
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
              {selectedInquiry && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedInquiry(null)}
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
                      <h2 className="text-2xl font-bold text-gray-800">{selectedInquiry.subject}</h2>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={() => setSelectedInquiry(null)}
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
                            <p className="font-medium text-gray-800">{selectedInquiry.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <motion.p
                              whileHover={{ color: '#1a4d2e' }}
                              className="font-medium text-blue-600 cursor-pointer"
                            >
                              {selectedInquiry.email}
                            </motion.p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Phone</p>
                            <p className="font-medium text-gray-800">{selectedInquiry.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Date</p>
                            <p className="font-medium text-gray-800">
                              {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Message</h3>
                        <p className="text-gray-600 leading-relaxed p-4 bg-gray-50 rounded-lg">
                          {selectedInquiry.message}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
                        <div className="flex gap-2">
                          {['pending', 'in-progress', 'resolved'].map((status) => (
                            <motion.button
                              key={status}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleStatusChange(
                                  selectedInquiry.id,
                                  status as 'pending' | 'in-progress' | 'resolved'
                                )
                              }
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedInquiry.status === status
                                  ? getStatusColor(status)
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {getStatusIcon(status)} {status}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 transition-all"
                        >
                          Send Reply
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedInquiry(null)}
                          className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                        >
                          Close
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
