'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { getContactInfo } from '@/lib/firestore';
import type { ContactInfo } from '@/types';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const categories = [
  'Chargers', 'Data Cables', 'Power Banks', 'Earbuds',
  'Bluetooth Speakers', 'Tempered Glass', 'Smart Watches', 'Neckbands',
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [info, setInfo] = useState<ContactInfo>({
    phone: '+91 99762 89418',
    whatsapp: '+91 99762 89418',
    email: 'info@kbkwholesale.in',
    address: 'Karambakkudi,\nPudukkottai District,\nTamil Nadu - 622302',
    mapLink: '',
    workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  });

  useEffect(() => {
    getContactInfo()
      .then((data) => {
        if (data) {
          setInfo({
            phone: data.phone || '+91 99762 89418',
            whatsapp: data.whatsapp || '+91 99762 89418',
            email: data.email || 'info@kbkwholesale.in',
            address: data.address || 'Karambakkudi,\nPudukkottai District,\nTamil Nadu - 622302',
            mapLink: data.mapLink || '',
            workingHours: data.workingHours || 'Mon – Sat: 9:00 AM – 7:00 PM',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full overflow-hidden relative shadow-md">
                <Image
                  src="/logo.png"
                  alt="KBK Logo"
                  width={44}
                  height={44}
                  className="object-cover"
                  style={{ height: 'auto' }}
                />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white">KBK</span>
                <p className="text-[10px] text-gray-400 font-medium leading-none -mt-0.5 tracking-widest uppercase">Wholesale</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India&apos;s trusted wholesale supplier of premium mobile accessories. Serving retailers with quality, reliability, and competitive pricing.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', label: 'Facebook', svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { href: '#', label: 'Instagram', svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg> },
                { href: '#', label: 'Twitter', svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { href: '#', label: 'YouTube', svg: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors duration-200 text-gray-400 hover:text-white"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-5">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-red-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 whitespace-pre-line">{info.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-red-400 shrink-0" />
                <div>
                  <a href={`tel:${info.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-gray-400 hover:text-red-400 transition-colors block">
                    {info.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-red-400 shrink-0" />
                <a href={`mailto:${info.email}`} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                  {info.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Business Hours</p>
              <p className="text-sm text-gray-300">{info.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-gray-500 text-center">
            © {year} KBK Wholesale. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms & Conditions</Link>
            <Link href="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
