'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 5000, suffix: '+', label: 'Products', desc: 'In our catalogue' },
  { value: 1500, suffix: '+', label: 'Retail Customers', desc: 'Trust us nationwide' },
  { value: 300, suffix: '+', label: 'Wholesale Partners', desc: 'Long-term relationships' },
  { value: 50, suffix: '+', label: 'Brands', desc: 'Top global brands' },
  { value: 100, suffix: '%', label: 'Customer Satisfaction', desc: 'Our guarantee' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="badge badge-blue mb-3 inline-flex">Our Numbers</span>
          <h2 className="heading-lg text-white">
            KBK by the <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Trusted by hundreds of retailers and distributors across India
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-blue-500/30 transition-all duration-300"
            >
              <p className="stat-number text-4xl font-black mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-gray-500 text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
