'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, Search, Star, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getProducts, deleteProduct, getCategories } from '@/lib/firestore';
import type { Product, Category } from '@/types';
import toast from 'react-hot-toast';

const stockLabels = {
  in_stock: { label: 'In Stock', color: 'text-emerald-400 bg-emerald-500/10' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-400 bg-red-500/10' },
  limited: { label: 'Limited', color: 'text-amber-400 bg-amber-500/10' },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.categoryName || 'Unknown';

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products in catalogue</p>
        </div>
        <Link href="/admin/products/add" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-gray-900 border border-gray-800 text-gray-300 placeholder-gray-600 rounded-xl px-4 py-2.5 pl-9 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 skeleton rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">
              {search ? 'No products match your search' : 'No products yet'}
            </p>
            {!search && (
              <Link href="/admin/products/add" className="btn-primary text-sm px-5 py-2 mt-4 inline-flex">
                Add First Product
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Product</th>
                <th className="text-left text-xs text-gray-500 font-medium px-3 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs text-gray-500 font-medium px-3 py-3 hidden lg:table-cell">Brand</th>
                <th className="text-left text-xs text-gray-500 font-medium px-3 py-3">Status</th>
                <th className="text-right text-xs text-gray-500 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => {
                const stock = stockLabels[product.stockStatus] || stockLabels.in_stock;
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.productName}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <Package size={16} className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-200 font-medium line-clamp-1">
                            {product.productName}
                          </p>
                          <p className="text-xs text-gray-600">{product.modelNumber}</p>
                        </div>
                        {product.featured && (
                          <Star size={12} className="text-amber-400 shrink-0" fill="currentColor" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-400">{getCategoryName(product.categoryId)}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{product.brand}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${stock.color}`}>
                        {stock.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
