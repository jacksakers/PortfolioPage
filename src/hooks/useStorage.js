import { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = (file, path) =>
    new Promise((resolve, reject) => {
      setUploading(true);
      setError(null);
      setProgress(0);
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (err) => {
          setError(err);
          setUploading(false);
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setUploading(false);
          setProgress(100);
          resolve(url);
        },
      );
    });

  return { uploadFile, progress, uploading, error };
}
