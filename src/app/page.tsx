import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import VisionSection from '@/components/home/VisionSection';
import ContactSection from '@/components/home/ContactSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <StatsSection />
        <AboutSection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
