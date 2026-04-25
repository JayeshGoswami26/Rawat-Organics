import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-24 pb-8 px-8 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
