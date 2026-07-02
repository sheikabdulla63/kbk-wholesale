'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Trash2, Award, X, Save, Upload } from 'lucide-react';
import { getBrands, addBrand, deleteBrand } from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import type { Brand } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [form, setForm] = useState({ brandName: '', description: '', logo: '' });

  const load = async () => {
    setLoading(true);
    try { setBrands(await getBrands()); }
    catch { toast.error('Failed to load brands'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logo;
      if (logoFile) {
        toast.loading('Uploading logo...');
        logoUrl = await uploadImage(logoFile, 'brands');
        toast.dismiss();
      }
      await addBrand({ brandName: form.brandName, description: form.description, logo: logoUrl });
      toast.success('Brand added!');
      setShowForm(false);
      setForm({ brandName: '', description: '', logo: '' });
      setLogoFile(null);
      setLogoPreview('');
      load();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add brand. Check Supabase config.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    try {
      await deleteBrand(id);
      toast.success('Brand deleted');
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch { toast.error('Failed to delete brand'); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Brands</h1>
          <p className="text-gray-500 text-sm mt-1">{brands.length} brands in your catalogue</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20">
          <Award size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No brands added yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-5 py-2.5">Add Brand</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {brand.logo ? (
                  <Image src={brand.logo} alt={brand.brandName} width={48} height={48} className="object-contain" />
                ) : (
                  <Award size={20} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{brand.brandName}</p>
                {brand.description && <p className="text-gray-500 text-xs truncate">{brand.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(brand.id, brand.brandName)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold text-lg">Add Brand</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Brand Name *</label>
                    <input
                      required type="text" value={form.brandName}
                      onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                      placeholder="e.g. Anker"
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Description</label>
                    <input
                      type="text" value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description"
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Brand Logo</label>
                    {logoPreview && (
                      <div className="w-16 h-16 bg-gray-800 rounded-xl overflow-hidden mb-2 relative">
                        <Image src={logoPreview} alt="logo preview" fill className="object-contain p-1" />
                      </div>
                    )}
                    <label className="flex items-center gap-3 w-full border border-dashed border-gray-700 hover:border-blue-500 rounded-xl px-4 py-3 cursor-pointer transition-colors">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-500">{logoFile ? logoFile.name : 'Upload logo'}</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-60">
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} />Save</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
