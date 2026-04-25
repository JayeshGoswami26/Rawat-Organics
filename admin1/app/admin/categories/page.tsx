'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { categories as initialCategories } from '@/lib/dummy-data';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useState as useStateCallback } from 'react';

const ITEMS_PER_PAGE = 6;

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    toast.loading('Creating category...');
    
    setTimeout(() => {
      const newCategory = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        image: 'https://via.placeholder.com/200',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setCategories([...categories, newCategory]);
      setFormData({ name: '', description: '' });
      setShowCreateModal(false);
      toast.success('Category created successfully!');
    }, 1000);
  };

  const handleEditCategory = async (id: string) => {
    toast.loading('Updating category...');
    
    setTimeout(() => {
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name: formData.name, description: formData.description } : cat
        )
      );
      setEditingId(null);
      setFormData({ name: '', description: '' });
      toast.success('Category updated successfully!');
    }, 1000);
  };

  const handleToggleActive = (id: string) => {
    toast.loading('Updating status...');
    
    setTimeout(() => {
      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat))
      );
      toast.success('Status updated successfully!');
    }, 800);
  };

  const openEditModal = (category: any) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
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
                className="flex justify-between items-center"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                  <p className="text-gray-600 mt-1">Manage your spice categories</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} />
                  New Category
                </motion.button>
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
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              {/* Categories Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                {paginatedCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <motion.img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openEditModal(category)}
                          className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                        >
                          <Edit2 size={16} />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleActive(category.id)}
                          className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
                            category.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-orange-600 hover:bg-orange-50'
                          }`}
                        >
                          {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          {category.isActive ? 'Active' : 'Inactive'}
                        </motion.button>
                      </div>
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

            {/* Modal */}
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg p-8 w-full max-w-md"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {editingId ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        editingId ? handleEditCategory(editingId) : handleCreateCategory()
                      }
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                    >
                      {editingId ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
