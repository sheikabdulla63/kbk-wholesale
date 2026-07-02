'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Tag, Package, CheckCircle, AlertCircle, Clock, ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ImageGallery from '@/components/products/ImageGallery';
import ProductCard from '@/components/products/ProductCard';
import { useCart } from '@/lib/cart';
import { getProductById, getProducts } from '@/lib/firestore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

const stockConfig = {
  in_stock: { label: 'In Stock', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  out_of_stock: { label: 'Out of Stock', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  limited: { label: 'Limited Stock', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const { addToCart, isInCart, getQuantity, updateQuantity, removeFromCart, setCartOpen } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const prod = await getProductById(id);
        setProduct(prod);
        if (prod) {
          const relatedProds = await getProducts({ categoryId: prod.categoryId, limitCount: 5 });
          setRelated(relatedProds.filter((p) => p.id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 min-h-screen">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 mt-8">
              <div className="skeleton aspect-square rounded-2xl" />
              <div className="space-y-4">
                <div className="skeleton h-8 w-3/4 rounded" />
                <div className="skeleton h-5 w-1/2 rounded" />
                <div className="skeleton h-24 w-full rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h1 className="heading-md text-gray-800 mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-6">This product might have been removed or doesn&apos;t exist.</p>
            <Link href="/products" className="btn-primary">Browse All Products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const stock = stockConfig[product.stockStatus] || stockConfig.in_stock;
  const StockIcon = stock.icon;
  const inCart = isInCart(product.id);
  const cartQty = getQuantity(product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  
  const primaryNumber = '919976289418';
  const whatsappMsg = `Hello KBK! I'm interested in the product: ${product.productName} (Model: ${product.modelNumber}). Please share pricing and availability for wholesale.`;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="section-container">
          {/* Breadcrumb */}
          <div className="py-4">
            <Breadcrumb
              items={[
                { label: 'Products', href: '/products' },
                { label: product.categoryName || 'Category', href: `/products?category=${product.categoryId}` },
                { label: product.productName },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 py-8">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <ImageGallery images={product.images || []} productName={product.productName} />
            </motion.div>

            {/* Product info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.featured && (
                  <span className="badge badge-orange">⭐ Featured</span>
                )}
                <span className={`badge flex items-center gap-1.5 ${stock.bg} ${stock.color}`}>
                  <StockIcon size={12} />
                  {stock.label}
                </span>
                <span className="badge badge-orange">Wholesale Available</span>
              </div>

              <h1 className="heading-md text-gray-900 mb-2 font-display">{product.productName}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Tag size={14} className="text-red-500" />
                  <span className="font-semibold text-gray-700">{product.brand}</span>
                </div>
                {product.modelNumber && (
                  <span className="text-sm text-gray-400">Model: {product.modelNumber}</span>
                )}
                {product.categoryName && (
                  <Link
                    href={`/products?category=${product.categoryId}`}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {product.categoryName}
                  </Link>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              {product.features?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-red-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        title={color}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 cursor-default"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    {Object.entries(product.specifications).map(([key, val], i) => (
                      <div
                        key={key}
                        className={`grid grid-cols-2 px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <span className="font-medium text-gray-600">{key}</span>
                        <span className="text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty */}
              {product.warranty && (
                <div className="mb-6 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">Warranty: {product.warranty}</span>
                </div>
              )}

              {/* Interactive Cart Stepper + Add Button */}
              {!isOutOfStock && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Select Wholesale Quantity</h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center justify-between border border-gray-250 rounded-xl overflow-hidden h-12 bg-white px-2">
                      <button
                        onClick={() => {
                          if (inCart) {
                            const newQty = cartQty - 1;
                            if (newQty <= 0) removeFromCart(product.id);
                            else updateQuantity(product.id, newQty);
                          } else {
                            setQty((prev) => Math.max(1, prev - 1));
                          }
                        }}
                        className="w-10 h-10 hover:bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-black transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-5 font-bold text-gray-800 text-lg min-w-[2.5rem] text-center">
                        {inCart ? cartQty : qty}
                      </span>
                      <button
                        onClick={() => {
                          if (inCart) {
                            updateQuantity(product.id, cartQty + 1);
                          } else {
                            setQty((prev) => prev + 1);
                          }
                        }}
                        className="w-10 h-10 hover:bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-black transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {inCart ? (
                      <button
                        onClick={() => setCartOpen(true)}
                        className="flex-1 h-12 flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
                      >
                        <ShoppingCart size={18} />
                        Open Cart Drawer
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addToCart(product, qty);
                          toast.success(`${product.productName} added to cart!`, { icon: '🛒' });
                        }}
                        className="flex-1 h-12 flex items-center justify-center gap-2.5 rounded-xl text-white font-bold transition-all hover:opacity-95 shadow-md shadow-red-500/10"
                        style={{ background: 'linear-gradient(135deg, #D40000, #FF6600)' }}
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Direct Enquiry Option */}
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${primaryNumber}?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:-translate-y-1 shadow-lg shadow-green-500/20"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
                >
                  <MessageCircle size={20} />
                  Enquire Directly on WhatsApp
                </a>
                <Link href="/contact" className="btn-outline w-full justify-center">
                  Contact Us Directly
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gray-100">
              <h2 className="heading-md text-gray-900 mb-6 font-display">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

