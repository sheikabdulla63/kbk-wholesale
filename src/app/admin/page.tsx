'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Award, Plus, TrendingUp, Clock, Star } from 'lucide-react';
import { getProducts, getCategories, getBrands } from '@/lib/firestore';
import type { Product, DashboardStats } from '@/types';

const statCards = [
  {
    key: 'totalProducts' as keyof DashboardStats,
    label: 'Total Products',
    icon: Package,
    color: '#0F4CFF',
    bg: '#EEF2FF',
    href: '/admin/products',
  },
  {
    key: 'totalCategories' as keyof DashboardStats,
    label: 'Categories',
    icon: FolderOpen,
    color: '#10B981',
    bg: '#ECFDF5',
    href: '/admin/categories',
  },
  {
    key: 'totalBrands' as keyof DashboardStats,
    label: 'Brands',
    icon: Award,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    href: '/admin/brands',
  },
  {
    key: 'featuredProducts' as keyof DashboardStats,
    label: 'Featured',
    icon: Star,
    color: '#F59E0B',
    bg: '#FFFBEB',
    href: '/admin/products?featured=true',
  },
];

const quickActions = [
  { label: 'Add Product', href: '/admin/products/add', icon: Package, color: 'bg-blue-600' },
  { label: 'Add Category', href: '/admin/categories', icon: FolderOpen, color: 'bg-emerald-600' },
  { label: 'Add Brand', href: '/admin/brands', icon: Award, color: 'bg-purple-600' },
  { label: 'View Analytics', href: '#', icon: TrendingUp, color: 'bg-amber-600' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    featuredProducts: 0,
  });
  const [recent, setRecent] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, categories, brands] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ]);
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalBrands: brands.length,
          featuredProducts: products.filter((p) => p.featured).length,
        });
        setRecent(products.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold font-display text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your catalogue.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={card.href}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: card.bg }}
                    >
                      <Icon size={18} style={{ color: card.color }} />
                    </div>
                    <TrendingUp size={14} className="text-gray-700 group-hover:text-gray-500 transition-colors" />
                  </div>
                  <p className="text-3xl font-black text-white font-display">
                    {loading ? '—' : stats[card.key]}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{card.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
        >
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus size={16} className="text-blue-400" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors group"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon size={15} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              Recent Products
            </h2>
            <Link href="/admin/products" className="text-xs text-blue-400 hover:text-blue-300">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 skeleton rounded-lg" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8">
              <Package size={32} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No products yet</p>
              <Link href="/admin/products/add" className="btn-primary text-xs px-4 py-2 mt-3 inline-flex">
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <Package size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-600">{product.brand} · {product.categoryName || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    product.stockStatus === 'in_stock'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : product.stockStatus === 'limited'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.stockStatus?.replace('_', ' ')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
