import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Stable reference for callers that omit constraints, so the default value
// doesn't create a new array (and re-trigger the effect) on every render.
const NO_CONSTRAINTS = [];

// queryConstraints: array of firestore query constraints (where, orderBy, etc.)
// Callers that pass a non-empty array MUST memoize it (e.g. via useMemo) so its
// reference only changes when the constraints actually change.
export function useCollection(collectionName, queryConstraints = NO_CONSTRAINTS) {
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
    // Depending on the queryConstraints array reference (rather than spreading its
    // elements) keeps this dependency array a fixed length across renders — spreading
    // a variable-length array here made the deps array change size whenever the
    // constraint count changed (e.g. no filter -> one `where` filter), which React
    // cannot reliably diff, so the effect could keep the old (unfiltered) subscription.
  }, [collectionName, queryConstraints]);

  return { data, loading, error };
}
