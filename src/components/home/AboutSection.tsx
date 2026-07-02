'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Clock, TrendingUp, Users, Package } from 'lucide-react';

const strengths = [
  {
    icon: Package,
    title: 'Vast Product Range',
    desc: '5000+ SKUs across 30+ categories — from chargers to smart accessories.',
    color: '#0F4CFF',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'Every product undergoes quality checks. We source from certified manufacturers.',
    color: '#8B5CF6',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    desc: 'Best wholesale prices in the market with special tiered discounts for volume orders.',
    color: '#10B981',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    desc: 'Pan-India delivery with same-day dispatch for in-stock items.',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    desc: 'Dedicated account managers for each wholesale partner. We are always available.',
    color: '#EF4444',
  },
  {
    icon: CheckCircle,
    title: 'Genuine Products',
    desc: '100% authentic products from authorized distributors and manufacturers.',
    color: '#06B6D4',
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge badge-blue mb-4 inline-flex">About KBK</span>
            <h2 className="heading-lg text-gray-900 mb-5">
              Who We <span className="gradient-text">Are</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              KBK is one of India&apos;s leading wholesale suppliers of mobile accessories, serving retailers, distributors, and corporate buyers since our founding. We built our reputation on trust, quality, and competitive pricing.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              From chargers and cables to smart watches and gaming accessories, our comprehensive catalogue covers everything a mobile accessories retailer needs. We work directly with top manufacturers to bring you the best products at the best prices.
            </p>
            <ul className="space-y-3">
              {[
                'Direct manufacturer partnerships for best prices',
                'Over 300 wholesale partners across India',
                'Quality assured products with warranty support',
                'Dedicated account management for each partner',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right card stack */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-display mb-4">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed mb-6">
                  To empower every retailer and distributor in India with access to premium mobile accessories at wholesale prices, backed by exceptional service and reliable supply.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Years in Business', value: '10+' },
                    { label: 'Cities Covered', value: '100+' },
                    { label: 'Daily Orders', value: '500+' },
                    { label: 'Return Rate', value: '<0.5%' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3">
                      <p className="text-2xl font-black font-display">{s.value}</p>
                      <p className="text-xs text-blue-200">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strengths grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-gray-900">
            Why Choose <span className="gradient-text">KBK</span>
          </h2>
          <p className="text-gray-500 mt-3">Six reasons thousands of retailers trust us</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengths.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card p-6 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${s.color}15` }}
                >
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
