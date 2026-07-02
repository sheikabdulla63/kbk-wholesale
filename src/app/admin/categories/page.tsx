'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Plus, Edit2, Trash2, FolderOpen, X, Save, Upload, ChevronDown
} from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const EMPTY_FORM = { categoryName: '', description: '', image: '', slug: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const load = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      categoryName: cat.categoryName,
      description: cat.description || '',
      image: cat.image || '',
      slug: cat.slug || slugify(cat.categoryName),
    });
    setImagePreview(cat.image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        toast.loading('Uploading image...');
        imageUrl = await uploadImage(imageFile, 'categories');
        toast.dismiss();
      }

      const payload = {
        categoryName: form.categoryName,
        description: form.description,
        image: imageUrl,
        slug: slugify(form.categoryName),
      };

      if (editingId) {
        await updateCategory(editingId, payload);
        toast.success('Category updated!');
      } else {
        await addCategory(payload);
        toast.success('Category created!');
      }
      setShowForm(false);
      load();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save category. Check Firebase config.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will become uncategorized.`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories in your catalogue</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Category grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No categories yet. Add your first one!</p>
          <button onClick={openAdd} className="btn-primary text-sm px-5 py-2.5">
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="h-32 bg-gray-800 relative">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.categoryName} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FolderOpen size={32} className="text-gray-600" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{cat.categoryName}</h3>
                    {cat.description && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="text-gray-600 text-[10px] mt-1">/{cat.slug}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.categoryName)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold text-lg">
                    {editingId ? 'Edit Category' : 'Add Category'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Category Name *</label>
                    <input
                      required
                      type="text"
                      value={form.categoryName}
                      onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                      placeholder="e.g. Fast Chargers"
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description..."
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Category Image</label>
                    {imagePreview && (
                      <div className="relative w-full h-28 bg-gray-800 rounded-xl overflow-hidden mb-2">
                        <Image src={imagePreview} alt="preview" fill className="object-cover" />
                      </div>
                    )}
                    <label className="flex items-center gap-3 w-full border border-dashed border-gray-700 hover:border-blue-500 rounded-xl px-4 py-3 cursor-pointer transition-colors">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {imageFile ? imageFile.name : 'Upload image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-60"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={14} />
                          {editingId ? 'Update' : 'Create'}
                        </>
                      )}
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
