'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Cable, Battery, Headphones, Speaker, Ear,
  Shield, Smartphone, Car, Plug, Watch, Gamepad2,
  MemoryStick, Usb, Wifi, Camera, HardDrive, Star
} from 'lucide-react';

const STATIC_CATEGORIES = [
  { name: 'Chargers', icon: Zap, color: '#FF6B35', bg: '#FFF0EA', count: 45 },
  { name: 'Data Cables', icon: Cable, color: '#0F4CFF', bg: '#EEF2FF', count: 38 },
  { name: 'Power Banks', icon: Battery, color: '#10B981', bg: '#ECFDF5', count: 22 },
  { name: 'Earphones', icon: Headphones, color: '#8B5CF6', bg: '#F5F3FF', count: 56 },
  { name: 'Bluetooth Speakers', icon: Speaker, color: '#F59E0B', bg: '#FFFBEB', count: 18 },
  { name: 'TWS Earbuds', icon: Ear, color: '#EC4899', bg: '#FDF2F8', count: 30 },
  { name: 'Tempered Glass', icon: Shield, color: '#06B6D4', bg: '#ECFEFF', count: 65 },
  { name: 'Phone Cases', icon: Smartphone, color: '#84CC16', bg: '#F7FEE7', count: 80 },
  { name: 'Car Chargers', icon: Car, color: '#EF4444', bg: '#FEF2F2', count: 24 },
  { name: 'Adapters', icon: Plug, color: '#6366F1', bg: '#EEF2FF', count: 19 },
  { name: 'Smart Watches', icon: Watch, color: '#14B8A6', bg: '#F0FDFA', count: 15 },
  { name: 'Gaming Accessories', icon: Gamepad2, color: '#F97316', bg: '#FFF7ED', count: 28 },
  { name: 'Memory Cards', icon: MemoryStick, color: '#0EA5E9', bg: '#F0F9FF', count: 12 },
  { name: 'USB Hubs', icon: Usb, color: '#A855F7', bg: '#FAF5FF', count: 9 },
  { name: 'Wireless Chargers', icon: Wifi, color: '#22C55E', bg: '#F0FDF4', count: 20 },
  { name: 'Camera Lens', icon: Camera, color: '#64748B', bg: '#F8FAFC', count: 14 },
  { name: 'Mobile Holders', icon: HardDrive, color: '#D97706', bg: '#FFFBEB', count: 17 },
  { name: 'Neckbands', icon: Star, color: '#E11D48', bg: '#FFF1F2', count: 25 },
];

interface CategoryCardProps {
  category: typeof STATIC_CATEGORIES[0];
  index: number;
  liveCount?: number;
}

function CategoryCard({ category, index, liveCount }: CategoryCardProps) {
  const slug = category.name.toLowerCase().replace(/\s+/g, '-');
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/products?category=${slug}`}
        className="block group"
      >
        <div className="card p-5 text-center overflow-hidden relative">
          {/* Top color bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-70"
            style={{ background: `linear-gradient(90deg, ${category.color}, ${category.color}88)` }}
          />

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
            style={{ background: category.bg }}
          >
            <Icon
              size={26}
              style={{ color: category.color }}
            />
          </div>

          <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors leading-tight">
            {category.name}
          </h3>
          <p className="text-xs text-gray-400">
            {liveCount ?? category.count} Products
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

interface CategoriesSectionProps {
  liveCategories?: Array<{ id: string; categoryName: string; productCount?: number }>;
}

export default function CategoriesSection({ liveCategories }: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-blue mb-3 inline-flex">Browse by Category</span>
          <h2 className="heading-lg text-gray-900">
            Product <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Explore our comprehensive range of mobile accessories organized by category
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {STATIC_CATEGORIES.map((cat, i) => {
            const live = liveCategories?.find(
              (l) => l.categoryName.toLowerCase() === cat.name.toLowerCase()
            );
            return (
              <CategoryCard
                key={cat.name}
                category={cat}
                index={i}
                liveCount={live?.productCount}
              />
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link href="/categories" className="btn-outline inline-flex">
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
