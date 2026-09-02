import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserPreferences } from '../types';

const DEFAULT_PREFS: UserPreferences = {
  gender: null,
  location: '',
  budgetMin: 5000,
  budgetMax: 15000,
  roomTypes: [],
  facilities: [],
  food: { included: false, veg: true, nonVeg: false },
};

interface PreferencesContextValue {
  prefs: UserPreferences;
  setPrefs: (p: Partial<UserPreferences>) => void;
  resetPrefs: () => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<UserPreferences>(DEFAULT_PREFS);
  const [onboarded, setOnboarded] = useState(false);

  const setPrefs = (p: Partial<UserPreferences>) => setPrefsState((prev) => ({ ...prev, ...p }));
  const resetPrefs = () => setPrefsState(DEFAULT_PREFS);

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs, resetPrefs, onboarded, setOnboarded }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
