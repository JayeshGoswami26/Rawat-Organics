import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit2, Eye, X, UploadCloud, Loader2, Star, Tag,
} from 'lucide-react';
import { productApi, categoryApi } from '@/lib/api';
import { toast } from 'sonner';

interface ProductImage { url: string; filename: string; isPrimary: boolean }
interface Attribute    { key: string; value: string }
interface Product {
  _id: string; name: string; slug: string;
  category: { _id: string; name: string } | string;
  description: string; shortDescription?: string;
  images: ProductImage[]; tags: string[]; attributes: Attribute[];
  isActive: boolean; isFeatured: boolean; createdAt: string;
}
interface Category { _id: string; name: string }

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName]           = useState('');
  const [formCategory, setFormCategory]   = useState('');
  const [formDesc, setFormDesc]           = useState('');
  const [formShort, setFormShort]         = useState('');
  const [formTags, setFormTags]           = useState('');
  const [formAttrs, setFormAttrs]         = useState<Attribute[]>([]);
  const [formFeatured, setFormFeatured]   = useState(false);
  const [formImages, setFormImages]       = useState<File[]>([]);
  const [formPreviews, setFormPreviews]   = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([productApi.getAll(), categoryApi.getAll()]);
      const prods = pRes.data.data?.products ?? pRes.data.products ?? pRes.data.data ?? pRes.data;
      const cats  = cRes.data.data?.categories ?? cRes.data.categories ?? cRes.data.data ?? cRes.data;
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch { toast.error('Failed to fetch products'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setFormName(''); setFormCategory(''); setFormDesc(''); setFormShort('');
    setFormTags(''); setFormAttrs([]); setFormFeatured(false);
    setFormImages([]); setFormPreviews([]);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const closeModal = () => { setShowModal(false); resetForm(); };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setFormImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setFormPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (idx: number) => {
    setFormPreviews((prev) => prev.filter((_, i) => i !== idx));
    setFormImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addAttr    = () => setFormAttrs((p) => [...p, { key: '', value: '' }]);
  const updateAttr = (i: number, f: 'key' | 'value', v: string) =>
    setFormAttrs((p) => p.map((a, idx) => idx === i ? { ...a, [f]: v } : a));
  const removeAttr = (i: number) => setFormAttrs((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!formName.trim() || !formCategory) {
      toast.error('Name and category are required'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', formName);
      fd.append('categoryId', formCategory);
      fd.append('description', formDesc);
      fd.append('shortDescription', formShort);
      fd.append('isFeatured', String(formFeatured));
      formTags.split(',').map((t) => t.trim()).filter(Boolean)
        .forEach((t, i) => fd.append(`tags[${i}]`, t));
      formAttrs.filter((a) => a.key && a.value)
        .forEach((a, i) => { fd.append(`attributes[${i}][key]`, a.key); fd.append(`attributes[${i}][value]`, a.value); });
      formImages.forEach((img) => fd.append('images', img));
      await productApi.create(fd);
      toast.success('Product created!');
      closeModal(); fetchData();
    } catch { toast.error('Failed to create product'); }
    finally  { setSubmitting(false); }
  };

  const getCatName = (cat: Product['category']) => {
    if (typeof cat === 'object' && cat !== null) return cat.name;
    return categories.find((c) => c._id === cat)?.name ?? 'Unknown';
  };
  const getCatId = (cat: Product['category']) =>
    typeof cat === 'object' && cat !== null ? cat._id : cat;
  const getPrimary = (imgs: ProductImage[]) =>
    (imgs.find((i) => i.isPrimary) ?? imgs[0])?.url;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || getCatId(p.category) === activeTab;
      return matchSearch && matchTab;
    });
  }, [products, search, activeTab]);

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
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">Manage your spice products</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
          >
            <Plus size={20} /> New Product
          </motion.button>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 border-b border-gray-200 overflow-x-auto"
        >
          {[{ _id: 'all', name: 'All Products' }, ...categories].map((cat) => (
            <motion.button
              key={cat._id}
              whileHover={{ textShadow: '0 0 8px rgba(26,77,46,0.3)' }}
              onClick={() => { setActiveTab(cat._id); setCurrentPage(1); setSearch(''); }}
              className={`px-6 py-3 font-medium transition-all relative whitespace-nowrap ${
                activeTab === cat._id ? 'text-primary' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {cat.name}
              {activeTab === cat._id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            {paginated.map((product) => (
              <motion.div
                key={product._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <img
                      src={getPrimary(product.images) ?? `https://placehold.co/400x160/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                      <Star size={12} fill="currentColor" /> Featured
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                    product.isActive ? 'bg-primary/90 text-white' : 'bg-gray-500/90 text-white'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    {getCatName(product.category)}
                  </p>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.shortDescription ?? product.description}
                  </p>
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{product.images.length} image{product.images.length !== 1 ? 's' : ''}</span>
                    <span>{product.attributes.length} attrs</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                    >
                      <Eye size={16} /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition-all"
                    >
                      <Edit2 size={16} /> Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {paginated.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg">{search ? 'No products found' : 'No products yet. Create your first one!'}</p>
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

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Product</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="col-span-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="col-span-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Short Description"
                  value={formShort}
                  onChange={(e) => setFormShort(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <textarea
                  placeholder="Full Description"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={3}
                />

                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Attributes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Attributes</span>
                    <button
                      type="button"
                      onClick={addAttr}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {formAttrs.map((attr, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        placeholder="Key"
                        value={attr.key}
                        onChange={(e) => updateAttr(i, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => updateAttr(i, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttr(i)}
                        className="text-red-400 hover:text-red-600 px-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Images */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formPreviews.map((src, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-5 text-gray-400 hover:border-primary hover:text-primary transition-colors">
                    <UploadCloud size={24} />
                    <span className="text-sm">Upload images (max 5)</span>
                    <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                  </label>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
                  <button
                    type="button"
                    onClick={() => setFormFeatured(!formFeatured)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${formFeatured ? 'bg-amber-400' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${formFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
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
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Product'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
