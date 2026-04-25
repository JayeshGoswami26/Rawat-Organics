'use client';

import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { analytics } from '@/lib/dummy-data';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Users, TrendingUp, Eye, Package } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="text-center"
    >
      <motion.div
        initial={{ textShadow: '0px 0px 0px rgba(0,0,0,0)' }}
        animate={{ textShadow: '0px 0px 20px rgba(26,77,46,0.2)' }}
        className="text-4xl font-bold text-primary"
      >
        {value.toLocaleString()}
      </motion.div>
      <p className="text-gray-600 text-sm mt-2">{label}</p>
    </motion.div>
  );
}

const categoryData = [
  { name: 'Whole Spice', value: analytics.categoryStats.wholeSvice },
  { name: 'Powder Spice', value: analytics.categoryStats.powderSpice },
];

const COLORS = ['#1a4d2e', '#2d7a4f'];

const trafficData = [
  { day: 'Mon', traffic: 4000 },
  { day: 'Tue', traffic: 3000 },
  { day: 'Wed', traffic: 2000 },
  { day: 'Thu', traffic: 2780 },
  { day: 'Fri', traffic: 1890 },
  { day: 'Sat', traffic: 2390 },
  { day: 'Sun', traffic: 3490 },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="pt-24 pb-8 px-8 bg-gray-50 min-h-screen">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Top Stats Cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Users Visited</p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {analytics.totalUsersVisited.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">New Users</p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {analytics.newUsers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Website Traffic</p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {analytics.websiteTraffic.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Products</p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {analytics.trendingProducts.length * 2}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Package className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Charts Section */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Category Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Website Traffic */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Website Traffic</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="traffic"
                        stroke="#1a4d2e"
                        strokeWidth={2}
                        dot={{ fill: '#1a4d2e', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>

              {/* Trending Products */}
              <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Trending Products</h3>
                <div className="space-y-4">
                  {analytics.trendingProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-primary font-bold">{index + 1}</span>
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.views} views</p>
                      </div>
                      <motion.div
                        className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
                        whileHover={{ scaleY: 1.2 }}
                        origin="center"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(product.views / 2500) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
