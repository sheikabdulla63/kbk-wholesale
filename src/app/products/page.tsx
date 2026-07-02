'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import { getProducts, getCategories } from '@/lib/firestore';
import type { Product, Category } from '@/types';
import { motion } from 'framer-motion';

// Demo products for when Firebase isn't configured
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', productName: '65W GaN Fast Charger', categoryId: 'chargers', categoryName: 'Chargers',
    brand: 'Anker', description: 'Ultra-compact 65W GaN charger.', specifications: { 'Output': '65W' },
    features: ['65W output', 'GaN technology'], colors: ['#FFFFFF', '#000000'],
    modelNumber: 'A2667', stockStatus: 'in_stock', featured: true, images: [],
    warranty: '18 months', createdAt: new Date().toISOString(),
  },
  {
    id: '2', productName: 'TWS Earbuds Pro X', categoryId: 'earbuds', categoryName: 'TWS Earbuds',
    brand: 'Boult', description: 'ANC TWS earbuds with 30hr battery.', specifications: { 'Battery': '30hr' },
    features: ['ANC', '30hr battery'], colors: ['#000000', '#F0F0F0'], modelNumber: 'B-ProX',
    stockStatus: 'in_stock', featured: true, images: [], warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '3', productName: '20000mAh Power Bank', categoryId: 'powerbanks', categoryName: 'Power Banks',
    brand: 'Baseus', description: 'Slim 20000mAh with 22.5W fast charging.', specifications: { 'Capacity': '20000mAh' },
    features: ['22.5W fast charge', 'LED display'], colors: ['#FFFFFF', '#000000'],
    modelNumber: 'BS-20K', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '4', productName: 'USB-C Braided Cable 2M', categoryId: 'cables', categoryName: 'Data Cables',
    brand: 'Baseus', description: '240W USB-C braided nylon cable.', specifications: { 'Length': '2M', 'Power': '240W' },
    features: ['240W charging', 'Braided nylon'], colors: ['#000000', '#C0C0C0', '#1E40AF'],
    modelNumber: 'CAT-C240', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '5', productName: 'Smart Watch Series 5', categoryId: 'smartwatches', categoryName: 'Smart Watches',
    brand: 'Fire-Boltt', description: '1.96" AMOLED smart watch.', specifications: { 'Display': '1.96" AMOLED' },
    features: ['GPS', 'AMOLED display'], colors: ['#000000', '#C0C0C0'], modelNumber: 'FBS5',
    stockStatus: 'limited', featured: true, images: [], warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '6', productName: 'Bluetooth Speaker Mini', categoryId: 'speakers', categoryName: 'Bluetooth Speakers',
    brand: 'JBL', description: 'IPX7 waterproof portable speaker with 12hr playback.', specifications: { 'Battery': '12hr' },
    features: ['IPX7 waterproof', '12hr battery'], colors: ['#EF4444', '#000000', '#3B82F6'],
    modelNumber: 'JBL-GO3', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
  {
    id: '7', productName: 'Tempered Glass iPhone 15', categoryId: 'temperedglass', categoryName: 'Tempered Glass',
    brand: 'Spigen', description: '9H hardness, anti-fingerprint tempered glass.', specifications: { 'Hardness': '9H' },
    features: ['9H hardness', 'Anti-fingerprint'], colors: ['#FFFFFF'], modelNumber: 'TGL-I15',
    stockStatus: 'in_stock', featured: false, images: [], warranty: '6 months', createdAt: new Date().toISOString(),
  },
  {
    id: '8', productName: 'Neckband Wireless Earphones', categoryId: 'neckbands', categoryName: 'Neckbands',
    brand: 'OnePlus', description: 'Magnetic neckband with 20hr battery and fast charge.', specifications: { 'Battery': '20hr' },
    features: ['Magnetic design', '20hr battery', 'Fast charge'], colors: ['#000000', '#C0C0C0'],
    modelNumber: 'NB-E1', stockStatus: 'in_stock', featured: false, images: [],
    warranty: '12 months', createdAt: new Date().toISOString(),
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods.length > 0 ? prods : DEMO_PRODUCTS);
        setCategories(cats);
      } catch {
        setProducts(DEMO_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        {/* Page header */}
        <div className="gradient-blue py-12 mb-8">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-red-100 text-sm font-medium mb-2">Browse our catalogue</p>
              <h1 className="heading-lg text-white font-display">All Products</h1>
              <p className="text-red-500 mt-2 opacity-90">
                Explore our extensive range of mobile accessories at wholesale prices
              </p>
            </motion.div>
          </div>
        </div>

        <div className="section-container">
          <ProductGrid
            products={products}
            categories={categories}
            loading={loading}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
