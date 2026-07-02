'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeletons';
import type { Product } from '@/types';
import { getProducts } from '@/lib/firestore';

// Static demo products for when Firebase isn't configured
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    productName: '65W GaN Fast Charger',
    categoryId: 'chargers',
    categoryName: 'Chargers',
    brand: 'Anker',
    description: 'Ultra-compact 65W GaN charger with foldable plug. Charges laptops, phones and tablets simultaneously.',
    specifications: { 'Output': '65W', 'Ports': 'USB-C + USB-A', 'Technology': 'GaN III' },
    features: ['65W output', 'GaN technology', 'Compact design', 'Multiple device charging'],
    colors: ['#FFFFFF', '#000000'],
    modelNumber: 'A2667',
    stockStatus: 'in_stock',
    featured: true,
    images: [],
    warranty: '18 months',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    productName: 'TWS Earbuds Pro X',
    categoryId: 'earbuds',
    categoryName: 'TWS Earbuds',
    brand: 'Boult',
    description: 'Active Noise Cancellation TWS earbuds with 30hr battery and Bluetooth 5.3.',
    specifications: { 'Battery': '30 hours', 'Connectivity': 'Bluetooth 5.3', 'ANC': 'Yes' },
    features: ['ANC', '30hr battery', 'IPX5 water resistant', 'Low latency gaming mode'],
    colors: ['#1a1a1a', '#F0F0F0', '#1E40AF'],
    modelNumber: 'B-ProX',
    stockStatus: 'in_stock',
    featured: true,
    images: [],
    warranty: '12 months',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    productName: '20000mAh Power Bank',
    categoryId: 'powerbanks',
    categoryName: 'Power Banks',
    brand: 'Baseus',
    description: 'Slim 20000mAh power bank with 22.5W fast charging. LED display shows remaining charge.',
    specifications: { 'Capacity': '20000mAh', 'Output': '22.5W', 'Ports': '2x USB-A + USB-C' },
    features: ['22.5W fast charge', 'LED display', 'Dual output', 'Slim profile'],
    colors: ['#FFFFFF', '#000000', '#1E40AF'],
    modelNumber: 'BS-20K',
    stockStatus: 'in_stock',
    featured: true,
    images: [],
    warranty: '12 months',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    productName: 'Smart Watch Series 5',
    categoryId: 'smartwatches',
    categoryName: 'Smart Watches',
    brand: 'Fire-Boltt',
    description: '1.96" AMOLED display smart watch with health tracking, GPS and 7-day battery.',
    specifications: { 'Display': '1.96" AMOLED', 'Battery': '7 days', 'GPS': 'Built-in' },
    features: ['AMOLED display', 'Built-in GPS', 'Heart rate monitor', 'Sleep tracking'],
    colors: ['#000000', '#C0C0C0', '#FFD700', '#1a1a1a'],
    modelNumber: 'FBS5',
    stockStatus: 'limited',
    featured: true,
    images: [],
    warranty: '12 months',
    createdAt: new Date().toISOString(),
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts({ featured: true, limitCount: 8 });
        setProducts(data.length > 0 ? data : DEMO_PRODUCTS);
      } catch {
        setProducts(DEMO_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="badge badge-blue mb-3 inline-flex">
              <Star size={10} /> Featured Products
            </span>
            <h2 className="heading-lg text-gray-900">
              Top <span className="gradient-text">Products</span>
            </h2>
            <p className="text-gray-500 mt-2">Hand-picked bestsellers from our catalogue</p>
          </div>
          <Link href="/products" className="btn-outline text-sm px-5 py-2.5 shrink-0">
            View All Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
