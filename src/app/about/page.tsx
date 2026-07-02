'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/home/AboutSection';
import VisionSection from '@/components/home/VisionSection';
import StatsSection from '@/components/home/StatsSection';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Page hero */}
        <div className="gradient-blue py-16">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-red-100 text-sm font-medium mb-2">Learn more about us</p>
              <h1 className="heading-lg text-white">About KBK</h1>
              <p className="text-red-500 mt-3 max-w-xl mx-auto opacity-90">
                India&apos;s trusted wholesale supplier of premium mobile accessories
              </p>
            </motion.div>
          </div>
        </div>

        <AboutSection />
        <StatsSection />
        <VisionSection />
      </main>
      <Footer />
    </>
  );
}
