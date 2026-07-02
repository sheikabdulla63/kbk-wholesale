'use client';

import dynamic from 'next/dynamic';

// Client wrapper for FloatingUI — ensures cart, WhatsApp button, and
// back-to-top are only rendered on the client (avoids SSR hydration issues)
const FloatingUI = dynamic(
  () => import('@/components/ui/FloatingButtons').then((m) => m.FloatingUI),
  { ssr: false }
);

export default function FloatingUIClient() {
  return <FloatingUI />;
}
