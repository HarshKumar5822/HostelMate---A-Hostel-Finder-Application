import { createContext, useContext, useState, type ReactNode } from 'react';

interface CollectionsContextValue {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
}

const CollectionsContext = createContext<CollectionsContextValue | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleSaved = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });

  return (
    <CollectionsContext.Provider
      value={{
        savedIds,
        toggleSaved,
        isSaved: (id) => savedIds.includes(id),
        compareIds,
        toggleCompare,
        isComparing: (id) => compareIds.includes(id),
        clearCompare: () => setCompareIds([]),
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error('useCollections must be used within CollectionsProvider');
  return ctx;
}
