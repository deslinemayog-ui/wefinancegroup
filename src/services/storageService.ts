import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';

export const storage = getStorage(app);

/**
 * Uploads a file (File object or Data URL string) to Firebase Storage.
 * Falls back to base64 Data URL if storage bucket fails or is offline.
 */
export async function uploadMediaFile(
  path: string,
  fileOrDataUrl: File | string
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    
    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://')) {
        return fileOrDataUrl;
      }
      if (fileOrDataUrl.startsWith('data:')) {
        await uploadString(storageRef, fileOrDataUrl, 'data_url');
        return await getDownloadURL(storageRef);
      }
      await uploadString(storageRef, fileOrDataUrl, 'base64');
      return await getDownloadURL(storageRef);
    } else {
      await uploadBytes(storageRef, fileOrDataUrl);
      return await getDownloadURL(storageRef);
    }
  } catch (err) {
    console.warn(`[Storage Service] Upload to ${path} failed, using local Data URL fallback:`, err);
    
    if (typeof fileOrDataUrl === 'string') {
      return fileOrDataUrl;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    });
  }
}

/**
 * Convert a File to base64 Data URL.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
