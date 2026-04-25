'use client';

import { motion } from 'framer-motion';
import { Bell, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export function Header() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: 'New inquiry from customer', time: '5 min ago' },
    { id: 2, message: 'Stock update needed', time: '1 hour ago' },
    { id: 3, message: 'New product review', time: '2 hours ago' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 z-40"
    >
      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-600 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold text-primary">{user?.name}</h2>
      </motion.div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Bell size={24} className="text-gray-600" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          {/* Notification dropdown */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3"
            >
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  whileHover={{ x: 4 }}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-all"
                >
                  <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500">{notif.time}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <span className="font-medium text-gray-800">{user?.name}</span>
            <motion.div
              animate={{ rotate: showProfile ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="text-gray-600" />
            </motion.div>
          </motion.button>

          {/* Profile dropdown */}
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Signed in as</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-all"
              >
                Profile Settings
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
