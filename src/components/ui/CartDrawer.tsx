'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, Package, MessageCircle, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/cart';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrderOnWhatsApp,
    cartOpen,
    setCartOpen,
  } = useCart();

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      showToast('⚠️ Your cart is empty!');
      return;
    }
    placeOrderOnWhatsApp();
    showToast('✅ Opening WhatsApp...');
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  return (
    <>
      {/* ── Toast notification ─────────────────────────────── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[500] bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium pointer-events-none"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Cart Trigger Button ────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
        onClick={() => setCartOpen(true)}
        className="cart-float"
        aria-label={`Open cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        title="View Cart"
      >
        <ShoppingCart size={22} className="text-white" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-white text-red-600 text-[11px] font-black rounded-full flex items-center justify-center shadow-md border border-red-100"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Backdrop ───────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Cart Drawer Panel ──────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="cart-drawer z-[400]"
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold font-display text-gray-900 text-lg leading-tight">My Cart</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {totalItems === 0 ? 'No items yet' : `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-600"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-red-200" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold text-base">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-1">Browse products and tap "Add to Cart"</p>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); window.location.href = '/products'; }}
                    className="btn-primary text-sm px-6 py-2.5 mt-2"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="pb-2">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="cart-item group"
                    >
                      {/* Product image */}
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.productName}
                            width={64}
                            height={64}
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package size={22} className="text-gray-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                          {item.product.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.product.brand} · {item.product.categoryName}</p>

                        {/* Quantity stepper */}
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold text-gray-900 w-7 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                          <span className="text-xs text-gray-400 ml-1">
                            {item.quantity > 1 ? 'units' : 'unit'}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Remove ${item.product.productName}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}

                  {/* Clear all */}
                  <div className="px-5 py-3 border-t border-gray-50">
                    <button
                      onClick={() => {
                        if (window.confirm('Remove all items from cart?')) clearCart();
                      }}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={11} />
                      Clear all items
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer: Place Order on WhatsApp ─────────── */}
            {items.length > 0 && (
              <div className="p-5 border-t-2 border-red-50 bg-gradient-to-b from-white to-red-50/30 shrink-0">
                {/* Order summary */}
                <div className="mb-4 p-3.5 bg-white rounded-2xl border border-orange-100 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Order Summary</p>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs text-gray-600 mb-1 leading-relaxed">
                      <span className="truncate mr-3 font-medium">{item.product.productName}</span>
                      <span className="shrink-0 text-gray-400">× {item.quantity}</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-100 flex justify-between text-sm font-bold text-gray-800">
                    <span>Total Items</span>
                    <span className="gradient-text">{totalItems} unit{totalItems !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Tip */}
                <p className="text-[11px] text-center text-gray-400 mb-3 leading-relaxed">
                  📱 Tapping below opens WhatsApp with your full order list — just hit <strong>Send</strong>!
                </p>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-green-500/25 transition-all"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  id="place-order-whatsapp"
                  aria-label="Place Order on WhatsApp"
                >
                  <MessageCircle size={22} />
                  Place Order on WhatsApp
                </motion.button>
                <p className="text-center text-[10px] text-gray-400 mt-2.5 leading-relaxed">
                  Free enquiry · No payment needed · Instant reply
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
