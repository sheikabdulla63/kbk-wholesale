'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Cable, Battery, Headphones, Speaker, Ear, Shield, Smartphone,
  Car, Plug, Watch, Gamepad2, MemoryStick, Usb, Wifi, Camera, HardDrive, Star
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCategories } from '@/lib/firestore';
import type { Category } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  'Chargers': Zap, 'Fast Chargers': Zap, 'Data Cables': Cable, 'USB Cables': Cable,
  'Power Banks': Battery, 'Earphones': Headphones, 'Bluetooth Speakers': Speaker,
  'TWS Earbuds': Ear, 'Tempered Glass': Shield, 'Phone Cases': Smartphone,
  'Car Chargers': Car, 'Adapters': Plug, 'Smart Watches': Watch,
  'Gaming Accessories': Gamepad2, 'Memory Cards': MemoryStick, 'USB Hubs': Usb,
  'Wireless Chargers': Wifi, 'Camera Lens': Camera, 'Mobile Holders': HardDrive, 'Neckbands': Star,
};

const COLORS = [
  '#FF6B35', '#FF6600', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899',
  '#06B6D4', '#84CC16', '#EF4444', '#6366F1', '#14B8A6', '#F97316',
  '#0EA5E9', '#A855F7', '#22C55E', '#64748B', '#D97706', '#E11D48',
];

const STATIC_CATEGORIES = [
  'Chargers', 'Fast Chargers', 'Data Cables', 'Power Banks', 'Earphones', 'Neckbands',
  'TWS Earbuds', 'Bluetooth Speakers', 'Tempered Glass', 'Phone Cases', 'Car Chargers',
  'Adapters', 'Smart Watches', 'Gaming Accessories', 'Memory Cards', 'USB Hubs',
  'Wireless Chargers', 'Camera Lens', 'Mobile Holders',
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        // Use static list if Firebase isn't connected
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayCategories = categories.length > 0
    ? categories
    : STATIC_CATEGORIES.map((name, i) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        categoryName: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: '',
        image: '',
        productCount: Math.floor(Math.random() * 50) + 10,
        createdAt: '',
      }));

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="gradient-blue py-16">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="heading-lg text-white">All Categories</h1>
              <p className="text-red-100 mt-3 opacity-90">Browse our complete product catalogue by category</p>
            </motion.div>
          </div>
        </div>

        <div className="section-container py-16">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {displayCategories.map((cat, i) => {
                const name = cat.categoryName;
                const Icon = ICON_MAP[name] || Zap;
                const color = COLORS[i % COLORS.length];
                const slug = cat.slug || name.toLowerCase().replace(/\s+/g, '-');

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % 10) * 0.05 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link href={`/products?category=${slug}`} className="block group">
                      <div className="card p-6 text-center overflow-hidden relative">
                        <div
                          className="absolute top-0 left-0 right-0 h-1"
                          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                        />
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 duration-300"
                          style={{ background: `${color}15` }}
                        >
                          <Icon size={26} style={{ color }} />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-red-600 transition-colors leading-tight">
                          {name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {cat.productCount ?? '-'} Products
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
