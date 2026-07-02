'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Tag, CheckCircle, AlertCircle, Clock, ShoppingCart, Plus, Minus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const stockConfig = {
  in_stock:     { label: 'In Stock',     icon: CheckCircle, color: 'badge-green' },
  out_of_stock: { label: 'Out of Stock', icon: AlertCircle, color: 'badge-red'   },
  limited:      { label: 'Limited',      icon: Clock,       color: 'badge-amber' },
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, isInCart, getQuantity, updateQuantity, removeFromCart } = useCart();
  const [qty, setQty] = useState(1);
  const [showQty, setShowQty] = useState(false);

  const stock = stockConfig[product.stockStatus] || stockConfig.in_stock;
  const StockIcon = stock.icon;
  const mainImage = product.images?.[0] || '';
  const inCart = isInCart(product.id);
  const cartQty = getQuantity(product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, qty);
    toast.success(`${product.productName} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });
    setShowQty(false);
    setQty(1);
  };

  const handleQtyChange = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      const newQty = cartQty + delta;
      if (newQty <= 0) removeFromCart(product.id);
      else updateQuantity(product.id, newQty);
    } else {
      setQty((prev) => Math.max(1, prev + delta));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image — links to detail */}
        <Link href={`/products/${product.id}`} className="block group">
          <div className="relative h-48 bg-gray-50 img-zoom-container">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.productName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package size={40} className="text-gray-300" />
              </div>
            )}
            {product.featured && (
              <span className="absolute top-2 left-2 badge badge-blue text-[10px]">⭐ Featured</span>
            )}
            <span className={`absolute top-2 right-2 badge ${stock.color} text-[10px] flex items-center gap-1`}>
              <StockIcon size={9} />
              {stock.label}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <Link href={`/products/${product.id}`} className="group flex-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-red-600 transition-colors line-clamp-2 mb-1.5">
              {product.productName}
            </h3>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={11} className="text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
              {product.modelNumber && (
                <>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{product.modelNumber}</span>
                </>
              )}
            </div>
          </Link>

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-1">
                {product.colors.slice(0, 5).map((color) => (
                  <div
                    key={color}
                    title={color}
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-[10px] text-gray-400">+{product.colors.length - 5}</span>
                )}
              </div>
            </div>
          )}

          {/* Cart section */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            {!isOutOfStock ? (
              <>
                {/* Quantity + Add row */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={(e) => handleQtyChange(-1, e)}
                      className="px-2 py-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-800 min-w-[1.5rem] text-center">
                      {inCart ? cartQty : qty}
                    </span>
                    <button
                      onClick={(e) => handleQtyChange(1, e)}
                      className="px-2 py-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-xs"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Add / In Cart button */}
                  {inCart ? (
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                      <ShoppingCart size={12} />
                      In Cart
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                      style={{ background: 'linear-gradient(135deg, #D40000, #FF6600)' }}
                    >
                      <ShoppingCart size={12} />
                      Add to Cart
                    </button>
                  )}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="block text-center text-xs text-red-600 hover:underline font-medium"
                >
                  View Details →
                </Link>
              </>
            ) : (
              <div className="text-center py-2">
                <span className="text-xs text-gray-400">Currently unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
