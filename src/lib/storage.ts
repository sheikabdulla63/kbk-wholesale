// ============================================================
// KBK Wholesale - Supabase Storage Helpers (with Base64 Fallback)
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'kbk-images';

/**
 * Convert a File to a Base64 Data URL (fallback when cloud storage is unavailable)
 */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * Automatically falls back to Base64 Data URL if storage bucket fails/missing.
 */
export async function uploadImage(
  file: File,
  folder: 'products' | 'categories' | 'brands' | 'settings'
): Promise<string> {
  if (!isSupabaseConfigured) {
    return fileToBase64(file);
  }

  try {
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload failed, falling back to Data URL:', error.message);
      return fileToBase64(file);
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.warn('Storage error, using Data URL fallback:', err);
    return fileToBase64(file);
  }
}

/**
 * Upload multiple images and return an array of public URLs / Data URLs.
 */
export async function uploadImages(
  files: File[],
  folder: 'products' | 'categories' | 'brands' | 'settings'
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadImage(f, folder)));
}

/**
 * Delete an image from Supabase Storage by its public URL.
 */
export async function deleteImage(url: string): Promise<void> {
  if (!isSupabaseConfigured || url.startsWith('data:')) return;

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/object/public/${BUCKET_NAME}/`);
    if (pathParts.length > 1) {
      const filePath = decodeURIComponent(pathParts[1]);
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }
  } catch {
    // Silently ignore if file doesn't exist
  }
}
