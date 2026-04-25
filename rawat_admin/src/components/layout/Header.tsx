import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NOTIFICATIONS = [
  { id: 1, message: 'New inquiry from customer', time: '5 min ago' },
  { id: 2, message: 'Stock update needed',        time: '1 hour ago' },
  { id: 3, message: 'New product review',         time: '2 hours ago' },
];

export default function Header() {
  const { user, logout } = useAuthStore();
  const [showNotif,   setShowNotif]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 z-40"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-600 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold text-primary">
          {user?.firstName ?? 'Admin'}{user?.lastName ? ` ${user.lastName}` : ''}
        </h2>
      </motion.div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Bell size={24} className="text-gray-600" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3"
            >
              {NOTIFICATIONS.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ x: 4 }}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-all"
                >
                  <p className="text-sm font-medium text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500">{n.time}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <span className="font-medium text-gray-800">{user?.firstName ?? 'Admin'}</span>
            <motion.div
              animate={{ rotate: showProfile ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="text-gray-600" />
            </motion.div>
          </motion.button>

          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Signed in as</p>
                <p className="font-medium text-gray-800 text-sm truncate">{user?.email ?? ''}</p>
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => { setShowProfile(false); logout(); }}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all text-sm"
              >
                Sign out
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
