'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { products as initialProducts } from '@/lib/dummy-data';
import { Search, Plus, Edit2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') as 'whole-spice' | 'powder-spice') || 'whole-spice';

  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
  });

  const handleCategoryChange = (newCategory: 'whole-spice' | 'powder-spice') => {
    router.push(`/admin/products?category=${newCategory}`);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (prod) =>
        prod.category === category &&
        (prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, category, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateProduct = async () => {
    if (!formData.name.trim() || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    toast.loading('Creating product...');

    setTimeout(() => {
      const newProduct = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        category,
        price: parseFloat(formData.price),
        views: 0,
        images: ['https://via.placeholder.com/400'],
        weight: formData.weight,
        benefits: ['High quality', 'Organic'],
        usage: 'Culinary use',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setProducts([...products, newProduct]);
      setFormData({ name: '', description: '', price: '', weight: '' });
      setShowCreateModal(false);
      toast.success('Product created successfully!');
    }, 1000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', weight: '' });
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
                  <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                  <p className="text-gray-600 mt-1">Manage your spice products</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} />
                  New Product
                </motion.button>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 border-b border-gray-200"
              >
                {['whole-spice', 'powder-spice'].map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ textShadow: '0 0 8px rgba(26,77,46,0.3)' }}
                    onClick={() => handleCategoryChange(cat as 'whole-spice' | 'powder-spice')}
                    className={`px-6 py-3 font-medium transition-all relative ${
                      category === cat ? 'text-primary' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {cat === 'whole-spice' ? 'Whole Spice' : 'Powder Spice'}
                    {category === cat && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.button>
                ))}
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
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
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
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
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
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">
                          ₹{product.price}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{product.weight}</span>
                          <span>👁️ {product.views}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                          >
                            <Eye size={16} />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition-all"
                          >
                            <Edit2 size={16} />
                            Edit
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

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

            {/* Create Modal */}
            <AnimatePresence>
              {showCreateModal && (
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
                    className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={3}
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="text"
                        placeholder="Weight (e.g., 100g)"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-600">Drag images or click to upload</p>
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
                        onClick={handleCreateProduct}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                      >
                        Create
                      </motion.button>
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
