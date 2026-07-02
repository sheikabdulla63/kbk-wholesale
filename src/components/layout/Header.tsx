'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { setCartOpen, totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-[0_8px_32px_rgba(212,0,0,0.12)] border-b border-white/20'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full overflow-hidden relative shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="KBK Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                  style={{ height: 'auto' }}
                  priority
                />
              </div>
              <div>
                <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white leading-none block">
                  KBK
                </span>
                <p className="text-[10px] text-gray-500 font-semibold leading-none mt-0.5 tracking-wider uppercase">
                  Wholesale
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-red-600 bg-red-50 dark:bg-red-950/20'
                        : 'text-gray-600 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA / Cart */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Header Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-red-50 rounded-xl transition-all"
                aria-label="View Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
                Get Quote
              </Link>
            </div>

            {/* Mobile Actions (Cart + Hamburger) */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-red-50 rounded-xl transition-all"
                aria-label="View Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative shadow-md">
                    <Image
                      src="/logo.png"
                      alt="KBK Logo"
                      width={36}
                      height={36}
                      className="object-cover"
                      style={{ height: 'auto' }}
                    />
                  </div>
                  <span className="font-bold font-display text-gray-900 dark:text-white">KBK</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="p-4 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Get Wholesale Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
