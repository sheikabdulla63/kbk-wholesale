'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BRANDS = [
  { name: 'Anker', emoji: '⚡', desc: 'Premium charging accessories' },
  { name: 'Baseus', emoji: '🔌', desc: 'Modern tech accessories' },
  { name: 'Boult', emoji: '🎵', desc: 'Audio products' },
  { name: 'boAt', emoji: '🎧', desc: 'Audio & wearables' },
  { name: 'Samsung', emoji: '📱', desc: 'Mobile accessories' },
  { name: 'Apple', emoji: '🍎', desc: 'Apple ecosystem accessories' },
  { name: 'OnePlus', emoji: '1️⃣', desc: 'Fast charging & audio' },
  { name: 'Realme', emoji: '🚀', desc: 'Budget accessories' },
  { name: 'Xiaomi', emoji: '🔋', desc: 'Eco-friendly charging' },
  { name: 'Oppo', emoji: '📸', desc: 'VOOC charging tech' },
  { name: 'JBL', emoji: '🔊', desc: 'Premium speakers' },
  { name: 'Sony', emoji: '🎶', desc: 'Audio excellence' },
  { name: 'Spigen', emoji: '🛡️', desc: 'Phone protection' },
  { name: 'Fire-Boltt', emoji: '⌚', desc: 'Smart wearables' },
  { name: 'Noise', emoji: '🎵', desc: 'Smart watches & audio' },
  { name: 'pTron', emoji: '🔌', desc: 'Budget accessories' },
  { name: 'Mivi', emoji: '🎧', desc: 'Audio accessories' },
  { name: 'Ugreen', emoji: '🟢', desc: 'Connectivity solutions' },
];

export default function BrandsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="gradient-blue py-16">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="heading-lg text-white">Our Brands</h1>
              <p className="text-red-100 mt-3 opacity-90">Top global brands available at KBK wholesale prices</p>
            </motion.div>
          </div>
        </div>

        <section className="py-16">
          <div className="section-container">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center mb-12 max-w-lg mx-auto"
            >
              We partner with 50+ leading mobile accessory brands to bring you authentic products at the best wholesale prices.
            </motion.p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BRANDS.map((brand, i) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.07 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="card p-5 text-center group cursor-default"
                >
                  <div className="text-3xl mb-2">{brand.emoji}</div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition-colors">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{brand.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-3xl bg-red-50/50 border border-red-100 text-center"
            >
              <h2 className="heading-md text-gray-900 mb-3">Don&apos;t see your brand?</h2>
              <p className="text-gray-500 mb-5">
                We work with 50+ brands and are constantly adding new ones. Contact us to check availability.
              </p>
              <a href="/contact" className="btn-primary inline-flex">Get in Touch</a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
