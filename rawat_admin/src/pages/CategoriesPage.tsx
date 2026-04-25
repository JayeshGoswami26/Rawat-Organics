import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit2, Eye, EyeOff, X, UploadCloud, Loader2,
} from 'lucide-react';
import { categoryApi } from '@/lib/api';
import { toast } from 'sonner';

interface Category {
  _id: string; name: string; slug: string; description?: string;
  image?: { url: string; filename: string }; isActive: boolean;
  sortOrder: number; createdAt: string;
}

const ITEMS_PER_PAGE = 6;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName]           = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage]         = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoryApi.getAll();
      const result = data.data?.categories ?? data.data ?? data;
      setCategories(Array.isArray(result) ? result : []);
    } catch { toast.error('Failed to fetch categories'); setCategories([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = () => {
    setFormName(''); setFormDescription('');
    setFormImage(null); setFormImagePreview(null); setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit   = (cat: Category) => {
    setEditing(cat); setFormName(cat.name); setFormDescription(cat.description ?? '');
    setFormImagePreview(cat.image?.url ?? null); setFormImage(null); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); resetForm(); };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setFormImage(file);
    const reader = new FileReader();
    reader.onload = () => setFormImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) { toast.error('Category name is required'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', formName);
      fd.append('description', formDescription);
      if (formImage) fd.append('image', formImage);
      if (editing) { await categoryApi.update(editing._id, fd); toast.success('Category updated!'); }
      else { await categoryApi.create(fd); toast.success('Category created!'); }
      closeModal(); fetchCategories();
    } catch { toast.error(editing ? 'Failed to update' : 'Failed to create'); }
    finally  { setSubmitting(false); }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!cat.isActive));
      await categoryApi.update(cat._id, fd);
      toast.success(`Category ${cat.isActive ? 'deactivated' : 'activated'}`);
      fetchCategories();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = useMemo(() =>
    categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(search.toLowerCase())
    ), [categories, search]);

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
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your spice categories</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
          >
            <Plus size={20} /> New Category
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {paginated.map((cat) => (
            <motion.div
              key={cat._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="h-40 bg-gray-200 overflow-hidden">
                <motion.img
                  src={cat.image?.url ?? `https://placehold.co/400x160/f3f4f6/9ca3af?text=${encodeURIComponent(cat.name)}`}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">{cat.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openEdit(cat)}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                  >
                    <Edit2 size={16} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleActive(cat)}
                    className={`flex items-center gap-1 px-3 py-2 rounded transition-all ${
                      cat.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {cat.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {paginated.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg">{search ? 'No categories found' : 'No categories yet. Create your first one!'}</p>
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

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editing ? 'Edit Category' : 'Create New Category'}
                </h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  placeholder="Description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={3}
                />
                {formImagePreview ? (
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <img src={formImagePreview} alt="Preview" className="h-36 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setFormImage(null); setFormImagePreview(null); }}
                      className="absolute right-2 top-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-6 text-gray-400 hover:border-primary hover:text-primary transition-colors">
                    <UploadCloud size={28} />
                    <span className="text-sm">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
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
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {submitting
                    ? <Loader2 size={18} className="animate-spin" />
                    : editing ? 'Update' : 'Create'
                  }
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
