'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Heart } from 'lucide-react';

export default function VisionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-blue" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
              <Eye size={16} className="text-blue-200" />
              <span className="text-sm font-semibold text-blue-100">Our Vision</span>
            </div>
            <h2 className="heading-lg text-white mb-6">
              Building India&apos;s Most Trusted Wholesale Network
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              At KBK, our vision is to become India&apos;s most trusted and preferred wholesale supplier of premium mobile accessories by delivering exceptional quality products, competitive pricing, reliable service, and long-term partnerships with retailers and distributors.
            </p>
          </motion.div>
        </div>

        {/* Mission, Vision, Values cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              desc: 'To empower every retailer in India with access to premium mobile accessories at unbeatable wholesale prices, backed by exceptional customer service and a seamless supply chain.',
            },
            {
              icon: Eye,
              title: 'Our Vision',
              desc: 'To become India\'s #1 wholesale supplier of mobile accessories, trusted by over 10,000 retailers and 1,000 distributors, with a pan-India presence and world-class product catalogue.',
            },
            {
              icon: Heart,
              title: 'Our Values',
              desc: 'Quality, integrity, transparency, and partnership. We believe in building long-term relationships based on trust, consistently delivering value to our wholesale network.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 hover:bg-white/15 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
