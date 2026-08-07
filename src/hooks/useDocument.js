import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!docId) {
      setData(null);
      setLoading(false);
      return undefined;
    }
    // Reset so a previous document's data doesn't briefly leak into this one.
    setData(null);
    setLoading(true);
    setError(null);
    const ref = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!active) return;
        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
      },
      (err) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      },
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [collectionName, docId]);

  return { data, loading, error };
}
