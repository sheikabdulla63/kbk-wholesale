'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeletons';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  loading?: boolean;
  title?: string;
}

const BRANDS = ['Samsung', 'Apple', 'Anker', 'Baseus', 'Boult', 'Boat', 'OnePlus', 'Realme', 'Xiaomi', 'Oppo'];

export default function ProductGrid({ products, categories, loading, title }: ProductGridProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const applyFilters = useCallback(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter((p) => p.categoryId === selectedCategory);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (selectedStock) result = result.filter((p) => p.stockStatus === selectedStock);

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name_asc':
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'name_desc':
        result.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
  }, [products, search, selectedCategory, selectedBrand, selectedStock, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedStock('');
    setSortBy('newest');
  };

  const hasFilters = search || selectedCategory || selectedBrand || selectedStock;

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="input-field pl-9 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-44"
          >
            <option value="newest">Newest First</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="featured">Featured First</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || hasFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && (
              <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                {[search, selectedCategory, selectedBrand, selectedStock].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-3 border-t border-gray-100">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </select>

                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Brands</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Availability</option>
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              {hasFilters && (
                <div className="pt-3 flex justify-end">
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                    <X size={12} />
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        {title && <h2 className="heading-md text-gray-900">{title}</h2>}
        <p className="text-sm text-gray-500 ml-auto">
          Showing <strong className="text-gray-900">{filteredProducts.length}</strong> products
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Filter size={28} className="text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary text-sm px-5 py-2.5">
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div
          key={filteredProducts.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
