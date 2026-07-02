'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const badges = [
  { icon: Zap, text: '5000+ Products', color: 'text-blue-400' },
  { icon: Shield, text: 'Trusted Supplier', color: 'text-emerald-400' },
  { icon: Truck, text: 'Fast Delivery', color: 'text-purple-400' },
];

const floatingCards = [
  { emoji: '⚡', label: 'Fast Chargers', delay: 0, x: -30, y: -20 },
  { emoji: '🎧', label: 'Earbuds', delay: 0.5, x: 30, y: 20 },
  { emoji: '🔋', label: 'Power Banks', delay: 1, x: -20, y: 30 },
  { emoji: '📱', label: 'Accessories', delay: 1.5, x: 20, y: -30 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/8 rounded-full animate-blob"
          style={{ animationDuration: '12s' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/8 rounded-full animate-blob"
          style={{ animationDuration: '16s', animationDelay: '4s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full animate-blob"
          style={{ animationDuration: '20s', animationDelay: '8s' }}
        />
        {/* Grid dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F4CFF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="section-container relative z-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-blue-700">India&apos;s #1 Wholesale Supplier</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="heading-xl text-gray-900 mb-3">
                <span className="gradient-text">KBK</span>
              </h1>
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold font-display text-gray-800 leading-tight mb-4">
                Your Trusted Mobile Accessories{' '}
                <span className="gradient-text">Wholesale Partner</span>
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg"
            >
              Providing premium mobile accessories with reliable quality, competitive wholesale pricing, and fast delivery for retailers and distributors across India.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link href="/products" className="btn-primary text-base px-7 py-3.5 group">
                Browse Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-outline text-base px-7 py-3.5">
                Contact Us
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-5"
            >
              {badges.map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={16} className={color} />
                  <span className="text-sm font-medium text-gray-600">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Central circle */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Gradient orb */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-200/30" />
              <div className="absolute inset-16 rounded-full gradient-blue opacity-90 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Zap className="w-16 h-16 mx-auto mb-3 opacity-90" fill="white" />
                  <p className="text-3xl font-black font-display">KBK</p>
                  <p className="text-sm opacity-80 font-medium">Wholesale</p>
                </div>
              </div>

              {/* Orbiting rings */}
              <div className="absolute inset-4 rounded-full border border-blue-200/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-0 rounded-full border border-blue-100/15 animate-spin" style={{ animationDuration: '50s', animationDirection: 'reverse' }} />

              {/* Floating product cards */}
              {floatingCards.map(({ emoji, label, delay, x, y }, i) => {
                const positions = [
                  { top: '5%', left: '50%', transform: 'translateX(-50%)' },
                  { right: '0', top: '40%' },
                  { bottom: '5%', left: '50%', transform: 'translateX(-50%)' },
                  { left: '0', top: '40%' },
                ];
                return (
                  <motion.div
                    key={label}
                    className="absolute glass rounded-2xl px-3 py-2.5 shadow-lg border border-white/40 flex items-center gap-2 z-10"
                    style={positions[i]}
                    animate={{
                      y: [0, y, 0],
                      x: [0, x * 0.3, 0],
                    }}
                    transition={{
                      duration: 4 + i,
                      delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">{label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '5000+', label: 'Products' },
            { value: '1500+', label: 'Retail Customers' },
            { value: '300+', label: 'Wholesale Partners' },
            { value: '50+', label: 'Brands' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-4 text-center shadow-sm"
            >
              <p className="stat-number text-3xl font-black">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 0C1440 0 1080 50 720 50C360 50 0 0 0 0L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
