'use client';

import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { products } from '@/lib/dummy-data';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const product = products.find((p) => p.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(product || {});

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="pt-24 px-8 bg-gray-50 min-h-screen flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Go Back
                </button>
              </motion.div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleSaveEdit = () => {
    toast.loading('Saving changes...');
    setTimeout(() => {
      setIsEditing(false);
      toast.success('Product updated successfully!');
    }, 1000);
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
              className="max-w-4xl mx-auto"
            >
              {/* Back Button */}
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-all"
              >
                <ArrowLeft size={20} />
                Back
              </motion.button>

              {/* Main Content */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Images */}
                <motion.div
                  className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({ ...editData, description: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                      )}
                    </div>

                    {/* Usage */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.usage}
                          onChange={(e) =>
                            setEditData({ ...editData, usage: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <p className="text-gray-600">{product.usage}</p>
                      )}
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Health Benefits</h3>
                      <div className="space-y-2">
                        {product.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                            <span className="text-gray-700">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div className="space-y-4">
                  {/* Price Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <p className="text-gray-600 text-sm mb-2">Price</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-2xl font-bold"
                      />
                    ) : (
                      <p className="text-4xl font-bold text-primary">₹{product.price}</p>
                    )}
                  </motion.div>

                  {/* Weight Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <p className="text-gray-600 text-sm mb-2">Weight</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.weight}
                        onChange={(e) =>
                          setEditData({ ...editData, weight: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-2xl font-bold"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">{product.weight}</p>
                    )}
                  </motion.div>

                  {/* Views Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <p className="text-gray-600 text-sm mb-2">Total Views</p>
                    <p className="text-3xl font-bold text-blue-600">{product.views}</p>
                  </motion.div>

                  {/* Category Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <p className="text-gray-600 text-sm mb-2">Category</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {product.category === 'whole-spice' ? 'Whole Spice' : 'Powder Spice'}
                    </span>
                  </motion.div>

                  {/* Status Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <p className="text-gray-600 text-sm mb-2">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </motion.div>

                  {/* Edit/Save Buttons */}
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditing(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-all"
                      >
                        <Edit2 size={18} />
                        Edit
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditing(false)}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveEdit}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Save size={18} />
                          Save
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
