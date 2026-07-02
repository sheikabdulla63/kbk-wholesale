// ============================================================
// KBK Wholesale - Supabase Storage Helpers
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'kbk-images';

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadImage(
  file: File,
  folder: 'products' | 'categories' | 'brands' | 'settings'
): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Storage is not configured');
  }

  const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Upload multiple images and return an array of public URLs.
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
  if (!isSupabaseConfigured) return;

  try {
    // Extract the file path from the public URL
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
