import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Eye, Package } from 'lucide-react';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { analyticsApi, productApi } from '@/lib/api';

interface OverviewData {
  totalViews: number;
  uniqueSessions: number;
  last30DaysViews: number;
  viewsByPageType: Record<string, number>;
  recentDailyViews: Array<{ date: string; count: number }>;
}
interface CategoryView { categoryId: string; views: number; name: string; slug: string }
interface ProductView  { productId: string;  views: number; name: string; slug: string }

const COLORS = ['#1a4d2e', '#2d7a4f', '#3d9a6e', '#5bb88a', '#80d0a8'];

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  const [overview, setOverview]         = useState<OverviewData | null>(null);
  const [categoryViews, setCategoryViews] = useState<CategoryView[]>([]);
  const [productViews, setProductViews] = useState<ProductView[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [overRes, catVRes, prodVRes, prodsRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getCategories(),
          analyticsApi.getProducts(10),
          productApi.getAll(),
        ]);
        setOverview(overRes.data.data ?? overRes.data);
        setCategoryViews(catVRes.data.data?.categoryViews ?? catVRes.data.categoryViews ?? []);
        setProductViews(prodVRes.data.data?.productViews ?? prodVRes.data.productViews ?? []);
        const prods = prodsRes.data.data?.products ?? prodsRes.data.products ?? prodsRes.data.data ?? prodsRes.data;
        setTotalProducts(Array.isArray(prods) ? prods.length : 0);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const pieData = categoryViews.length > 0
    ? categoryViews.map((cv) => ({ name: cv.name, value: cv.views }))
    : [{ name: 'No Data', value: 1 }];

  const trafficData = (overview?.recentDailyViews ?? []).map((d) => ({
    day: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    traffic: d.count,
  }));
  if (trafficData.length === 0) {
    trafficData.push(...['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => ({ day: d, traffic: 0 })));
  }

  const maxViews = Math.max(...productViews.map((p) => p.views), 1);

  const statCards = [
    { label: 'Total Users Visited', value: overview?.totalViews ?? 0,    icon: Users,       iconBg: 'bg-primary/10',    iconColor: 'text-primary' },
    { label: 'Unique Visitors',      value: overview?.uniqueSessions ?? 0, icon: TrendingUp,  iconBg: 'bg-green-100',     iconColor: 'text-green-600' },
    { label: 'Website Traffic',      value: overview?.last30DaysViews ?? 0, icon: Eye,        iconBg: 'bg-blue-100',      iconColor: 'text-blue-600' },
    { label: 'Total Products',       value: totalProducts,                  icon: Package,    iconBg: 'bg-purple-100',    iconColor: 'text-purple-600' },
  ];

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <motion.div
              key={label}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{label}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{value.toLocaleString()}</p>
                </div>
                <div className={`${iconBg} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line */}
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
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Trending Products</h3>
          {productViews.length > 0 ? (
            <div className="space-y-4">
              {productViews.slice(0, 10).map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0"
                  >
                    <span className="text-primary font-bold">{index + 1}</span>
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name ?? 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{product.views} views</p>
                  </div>
                  <motion.div
                    className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
                    whileHover={{ scaleY: 1.2 }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.views / maxViews) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No product view data yet</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
