'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderOpen, Award, Settings,
  LogOut, Zap, ChevronRight, Globe
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Brands', href: '/admin/brands', icon: Award },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  const handleSignOut = async () => {
    await signOutUser();
    toast.success('Signed out successfully');
    router.replace('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 min-h-screen fixed left-0 top-0 bottom-0 flex flex-col z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-white font-bold font-display">KBK Admin</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">Control Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/6 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={17} />
            View Website
          </Link>
          <div className="px-3 py-2.5">
            <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
            <p className="text-xs text-gray-300 font-medium truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
