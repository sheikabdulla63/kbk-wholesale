# KBK Wholesale Website

**Premium B2B Mobile Accessories Wholesale Website**

Built with Next.js 15, Firebase, TypeScript, Tailwind CSS, and Framer Motion.

---

## 🚀 Quick Start

### 1. Clone / Open the Project
```bash
cd kbk-wholesale
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
Copy the environment template:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Firebase credentials (see "Firebase Setup" below).

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔥 Firebase Setup

### Step 1 — Create a Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `kbk-wholesale`
3. Disable Google Analytics (optional)

### Step 2 — Enable Authentication
1. Go to **Authentication** → **Get started**
2. Enable **Email/Password** provider
3. Go to **Users** → **Add user**
4. Create your admin account (e.g., `admin@kbk.com`, strong password)

### Step 3 — Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** → select your region → **Enable**
3. Go to **Rules** tab → replace with contents of `firestore.rules`

### Step 4 — Enable Storage
1. Go to **Storage** → **Get started**
2. Choose **Production mode** → **Done**
3. Go to **Rules** tab → replace with contents of `storage.rules`

### Step 5 — Get Your Config Keys
1. Go to **Project Settings** (gear icon) → **Your apps**
2. Click **Web** icon → register app → copy the `firebaseConfig` object
3. Add each value to your `.env.local` file

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout (SEO + fonts)
│   ├── globals.css           # Design system CSS
│   ├── sitemap.ts            # SEO sitemap generator
│   ├── about/page.tsx        # About page
│   ├── brands/page.tsx       # Brands page
│   ├── categories/page.tsx   # All categories page
│   ├── contact/page.tsx      # Contact page
│   ├── products/
│   │   ├── page.tsx          # Products listing + search + filters
│   │   └── [id]/page.tsx     # Product detail page
│   └── admin/
│       ├── layout.tsx        # Admin layout (auth guard)
│       ├── page.tsx          # Admin dashboard
│       ├── login/page.tsx    # Admin login
│       ├── products/
│       │   ├── page.tsx      # Products management
│       │   ├── add/page.tsx  # Add product form
│       │   └── [id]/edit/page.tsx  # Edit product
│       ├── categories/page.tsx  # Category management
│       ├── brands/page.tsx      # Brand management
│       └── settings/page.tsx    # Contact & company settings
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Sticky glassmorphism header
│   │   └── Footer.tsx        # Dark premium footer
│   ├── home/
│   │   ├── HeroSection.tsx   # Full-screen hero with animations
│   │   ├── CategoriesSection.tsx  # Category cards grid
│   │   ├── FeaturedProducts.tsx   # Featured products section
│   │   ├── AboutSection.tsx       # Company info + strengths
│   │   ├── StatsSection.tsx       # Animated number counters
│   │   ├── VisionSection.tsx      # Vision/Mission/Values
│   │   └── ContactSection.tsx     # Contact form + map
│   ├── products/
│   │   ├── ProductCard.tsx   # Reusable product card
│   │   ├── ProductGrid.tsx   # Search + filter + grid
│   │   └── ImageGallery.tsx  # Gallery with lightbox
│   ├── admin/
│   │   └── ProductForm.tsx   # Add/Edit product form
│   └── ui/
│       ├── Breadcrumb.tsx    # Breadcrumb navigation
│       ├── FloatingButtons.tsx  # WhatsApp + Back-to-top
│       └── Skeletons.tsx     # Loading skeleton components
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   ├── firestore.ts          # All Firestore CRUD operations
│   ├── storage.ts            # Firebase Storage helpers
│   └── auth.tsx              # Auth context + useAuth hook
└── types/
    └── index.ts              # TypeScript type definitions
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#0F4CFF` |
| Gradient | `#0F4CFF → #4F46E5 → #7C3AED` |
| Font Display | Outfit (headings) |
| Font Body | Inter (body text) |
| Border Radius | `1.25rem` (cards), `0.75rem` (buttons) |

**Key CSS classes:**
- `.btn-primary` — Blue gradient button
- `.btn-outline` — Blue border button  
- `.card` — White card with hover lift
- `.glass` — Glassmorphism element
- `.gradient-text` — Blue-to-purple gradient text
- `.section-container` — 1280px centered container
- `.heading-xl`, `.heading-lg`, `.heading-md` — Responsive headings
- `.skeleton` — Shimmer loading skeleton

---

## 🛡️ Security

- **Public access:** Read-only to all Firestore collections
- **Admin access:** Full CRUD after Firebase email/password login
- **Admin routes:** `/admin/*` protected by `useAuth()` context
- **Storage:** Images readable by all, writable by authenticated admin only
- **robots.txt:** Blocks `/admin` from search engine crawlers

---

## 📦 Firestore Data Structure

### `categories` collection
```json
{
  "categoryName": "Fast Chargers",
  "description": "USB-C and multi-port fast chargers",
  "image": "https://firebasestorage.googleapis.com/...",
  "slug": "fast-chargers",
  "createdAt": "Timestamp"
}
```

### `products` collection
```json
{
  "productName": "65W GaN Fast Charger",
  "categoryId": "category-doc-id",
  "brand": "Anker",
  "description": "...",
  "specifications": { "Output": "65W", "Ports": "USB-C + USB-A" },
  "features": ["GaN technology", "Compact design"],
  "colors": ["#FFFFFF", "#000000"],
  "modelNumber": "A2667",
  "stockStatus": "in_stock",
  "featured": true,
  "images": ["https://firebasestorage.googleapis.com/..."],
  "warranty": "18 months",
  "createdAt": "Timestamp"
}
```

### `contact` collection
```json
{
  "phone": "+91 98765 43210",
  "whatsapp": "+91 98765 43210",
  "email": "info@kbkwholesale.in",
  "address": "123 Wholesale Market, Mumbai...",
  "mapLink": "https://maps.google.com/...",
  "workingHours": "Mon – Sat: 9 AM – 7 PM"
}
```

---

## 🚀 Deployment on Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial KBK wholesale website"
git remote add origin https://github.com/yourusername/kbk-wholesale.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### Step 3 — Set Custom Domain (Optional)
1. In Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `kbkwholesale.in`)
3. Update DNS records as instructed

### Step 4 — Update metadataBase
In `src/app/layout.tsx`, update:
```typescript
metadataBase: new URL('https://yourdomain.com'),
```

---

## 🔧 Customization Guide

### Change WhatsApp Number
In `src/components/ui/FloatingButtons.tsx`:
```typescript
const WHATSAPP_NUMBER = '919876543210'; // Your number
```

### Change Company Address
In `src/components/layout/Footer.tsx` and `ContactSection.tsx`.

### Change Google Maps Link
In `src/components/home/ContactSection.tsx` — update the iframe `src` with your location.

### Add Initial Data
After setting up Firebase:
1. Go to `/admin/login` → sign in
2. Add categories first (Admin → Categories)
3. Add products (Admin → Products → Add Product)

---

## ✅ Features Checklist

- [x] Sticky glassmorphism header with mobile hamburger menu
- [x] Hero section with animated blob backgrounds and floating cards
- [x] Category cards grid with hover lift animations
- [x] Featured products section with Firebase data
- [x] Animated statistics counter (scroll-triggered)
- [x] About section with strengths grid
- [x] Vision/Mission/Values section
- [x] Contact section with form, map, and WhatsApp
- [x] Product listing with search + live filters
- [x] Product detail page with image gallery + lightbox
- [x] Related products section
- [x] Admin dashboard with stats
- [x] Admin product CRUD (add/edit/delete)
- [x] Admin category management (create/edit/delete/image)
- [x] Admin brand management
- [x] Admin settings (contact info, logo)
- [x] Firebase Authentication (admin only)
- [x] Firebase Firestore integration
- [x] Firebase Storage image upload
- [x] Skeleton loading states
- [x] WhatsApp floating button with pulse animation
- [x] Back-to-top button
- [x] Breadcrumb navigation
- [x] SEO optimized (meta tags, OG tags, sitemap, robots.txt)
- [x] PWA manifest
- [x] Responsive design (mobile/tablet/desktop)
- [x] Framer Motion page transitions + hover animations

---

## 📞 Support

For issues with Firebase setup, refer to the [Firebase Documentation](https://firebase.google.com/docs).

© 2024 KBK Wholesale. All rights reserved.
