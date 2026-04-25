'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Folder, Package, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Folder, label: 'Categories', href: '/admin/categories' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Mail, label: 'Inquiries', href: '/admin/inquiries' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-primary text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-6 border-b border-white/10 flex items-center gap-3 cursor-pointer"
      >
        <Leaf className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold">Rawat</h1>
          <p className="text-xs text-white/60">Organics</p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-1 h-6 bg-white rounded"
                      layoutId="sidebar-indicator"
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 border-t border-white/10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 text-red-100 hover:bg-red-600/30 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
