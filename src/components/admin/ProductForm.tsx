'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getCategories, addProduct, updateProduct, getProductById } from '@/lib/firestore';
import { uploadImages } from '@/lib/storage';
import type { Category, Product } from '@/types';
import toast from 'react-hot-toast';

const COLORS_PRESET = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Rose Gold', hex: '#E8B4B8' },
  { name: 'Midnight Blue', hex: '#1E3A5F' },
];

interface ProductFormProps {
  editId?: string;
}

export default function ProductForm({ editId }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  const [form, setForm] = useState({
    productName: '',
    categoryId: '',
    brand: '',
    description: '',
    modelNumber: '',
    stockStatus: 'in_stock' as Product['stockStatus'],
    featured: false,
    warranty: '',
    compatibleDevices: '',
    specifications: {} as Record<string, string>,
  });

  useEffect(() => {
    const load = async () => {
      const cats = await getCategories();
      setCategories(cats);

      if (editId) {
        const product = await getProductById(editId);
        if (product) {
          setForm({
            productName: product.productName,
            categoryId: product.categoryId,
            brand: product.brand,
            description: product.description,
            modelNumber: product.modelNumber,
            stockStatus: product.stockStatus,
            featured: product.featured,
            warranty: product.warranty || '',
            compatibleDevices: product.compatibleDevices?.join(', ') || '',
            specifications: product.specifications || {},
          });
          setSelectedColors(product.colors || []);
          setFeatures(product.features?.length > 0 ? product.features : ['']);
          setExistingImages(product.images || []);
        }
      }
    };
    load();
  }, [editId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (i: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const toggleColor = (hex: string) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const addSpec = () => {
    if (specKey && specVal) {
      setForm((f) => ({ ...f, specifications: { ...f.specifications, [specKey]: specVal } }));
      setSpecKey('');
      setSpecVal('');
    }
  };

  const removeSpec = (key: string) => {
    const updated = { ...form.specifications };
    delete updated[key];
    setForm((f) => ({ ...f, specifications: updated }));
  };

  const updateFeature = (i: number, val: string) => {
    setFeatures((prev) => prev.map((f, idx) => (idx === i ? val : f)));
  };

  const addFeature = () => setFeatures((prev) => [...prev, '']);
  const removeFeature = (i: number) => setFeatures((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading('Uploading images...');
        newImageUrls = await uploadImages(imageFiles, 'products');
        toast.dismiss();
      }

      const payload = {
        ...form,
        colors: selectedColors,
        features: features.filter(Boolean),
        images: [...existingImages, ...newImageUrls],
        compatibleDevices: form.compatibleDevices
          ? form.compatibleDevices.split(',').map((s) => s.trim())
          : [],
      };

      if (editId) {
        await updateProduct(editId, payload);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(payload);
        toast.success('Product added successfully!');
      }
      router.push('/admin/products');
    } catch (err: unknown) {
      console.error('Product save error:', err);
      const error = err as { message?: string };
      toast.error(error.message || 'Failed to save product. Check database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            {editId ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {editId ? 'Update product details' : 'Add a new product to your catalogue'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Product Name *</label>
                <input
                  required
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="e.g. 65W GaN Fast Charger"
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Category *</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Brand *</label>
                  <input
                    required
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Anker"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Model Number</label>
                  <input
                    type="text"
                    value={form.modelNumber}
                    onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
                    placeholder="e.g. A2667"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Warranty</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    placeholder="e.g. 12 months"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Compatible Devices</label>
                <input
                  type="text"
                  value={form.compatibleDevices}
                  onChange={(e) => setForm({ ...form, compatibleDevices: e.target.value })}
                  placeholder="iPhone, Samsung Galaxy, OnePlus (comma-separated)"
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Key Features</h2>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus size={12} /> Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Specifications</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Key (e.g. Output)"
                className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="text"
                value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                placeholder="Value (e.g. 65W)"
                className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={addSpec}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            {Object.keys(form.specifications).length > 0 && (
              <div className="space-y-1.5">
                {Object.entries(form.specifications).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-400">{k}:</span>
                    <span className="text-gray-200">{v}</span>
                    <button
                      type="button"
                      onClick={() => removeSpec(k)}
                      className="text-gray-600 hover:text-red-400 ml-3 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Existing Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-800 rounded-xl overflow-hidden">
                      <Image src={url} alt={`existing-${i}`} fill className="object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">New Images</p>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-800 rounded-xl overflow-hidden">
                      <Image src={src} alt={`preview-${i}`} fill className="object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl cursor-pointer transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-500" />
                <span className="text-sm text-gray-500">Click to upload images</span>
                <span className="text-xs text-gray-700">PNG, JPG up to 10MB each</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Product Status</h3>
            <div className="space-y-3">
              {[
                { val: 'in_stock', label: '✅ In Stock' },
                { val: 'limited', label: '⚠️ Limited Stock' },
                { val: 'out_of_stock', label: '❌ Out of Stock' },
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="stockStatus"
                    value={opt.val}
                    checked={form.stockStatus === opt.val}
                    onChange={() => setForm({ ...form, stockStatus: opt.val as Product['stockStatus'] })}
                    className="accent-blue-500"
                  />
                  <span className="text-sm text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-sm text-gray-300">⭐ Featured Product</span>
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Available Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {COLORS_PRESET.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  title={color.name}
                  onClick={() => toggleColor(color.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(color.hex)
                      ? 'border-blue-400 scale-110 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">{selectedColors.length} color(s) selected</p>
            )}
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {editId ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
