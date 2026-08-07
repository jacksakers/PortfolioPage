import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// queryConstraints: array of firestore query constraints (where, orderBy, etc.)
export function useCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset immediately so a stale result from the previous query/collection is
    // never shown while the new subscription is still connecting.
    let active = true;
    setData([]);
    setLoading(true);
    setError(null);
    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        setData(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, ...queryConstraints]);

  return { data, loading, error };
}
