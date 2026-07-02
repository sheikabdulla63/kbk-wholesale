// ============================================================
// KBK Wholesale - Firebase Storage Helpers
// ============================================================

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file to Firebase Storage and return its download URL.
 */
export async function uploadImage(
  file: File,
  folder: 'products' | 'categories' | 'brands' | 'settings'
): Promise<string> {
  const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const storageRef = ref(storage, fileName);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

/**
 * Upload multiple images and return an array of download URLs.
 */
export async function uploadImages(
  files: File[],
  folder: 'products' | 'categories' | 'brands' | 'settings'
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadImage(f, folder)));
}

/**
 * Delete an image from Firebase Storage by its download URL.
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Silently ignore if file doesn't exist
  }
}
