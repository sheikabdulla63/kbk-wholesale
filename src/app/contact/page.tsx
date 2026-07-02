'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="gradient-blue py-16">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-red-100 text-sm font-medium mb-2">We&apos;d love to hear from you</p>
              <h1 className="heading-lg text-white">Contact KBK</h1>
              <p className="text-red-500 mt-3 max-w-xl mx-auto opacity-90">
                Reach out for wholesale inquiries, product information, or partnership opportunities
              </p>
            </motion.div>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
