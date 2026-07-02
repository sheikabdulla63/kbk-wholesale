import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import FloatingUIClient from '@/components/ui/FloatingUIClient';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#D40000',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kbkwholesale.in'),
  title: {
    default: 'KBK — Mobile Accessories Wholesale Supplier',
    template: '%s | KBK Wholesale',
  },
  description:
    "KBK is India's trusted wholesale supplier of premium mobile accessories. Browse our catalogue of chargers, cables, earphones, power banks, and more at competitive wholesale prices.",
  keywords: [
    'mobile accessories wholesale',
    'KBK wholesale',
    'chargers wholesale India',
    'mobile accessories supplier',
    'earphones wholesale',
    'power banks wholesale',
    'cable wholesale',
    'mobile accessories dealer',
    'Karambakkudi wholesale',
    'Tamil Nadu mobile accessories',
  ],
  authors: [{ name: 'KBK Wholesale' }],
  creator: 'KBK Wholesale',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kbkwholesale.in',
    siteName: 'KBK Wholesale',
    title: 'KBK — Mobile Accessories Wholesale Supplier',
    description:
      'Premium mobile accessories at wholesale prices. Trusted by 1500+ retailers across India.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KBK Wholesale' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KBK — Mobile Accessories Wholesale Supplier',
    description: 'Premium mobile accessories at wholesale prices.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingUIClient />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
                success: {
                  iconTheme: { primary: '#D40000', secondary: '#fff' },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
