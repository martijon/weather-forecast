import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { FavoriteCity } from '../types/favorites';

const STORAGE_KEY = 'weather-favorite-cities';

interface FavoritesContextType {
  favorites: FavoriteCity[];
  addFavorite: (city: string, country: string) => void;
  removeFavorite: (cityName: string) => void;
  isFavorite: (cityName: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const loadFavorites = (): FavoriteCity[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: FavoriteCity[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((city: string, country: string) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.name.toLowerCase() === city.toLowerCase()
      );
      if (exists) return prev;
      return [...prev, { name: city, country, addedAt: Date.now() }];
    });
  }, []);

  const removeFavorite = useCallback((cityName: string) => {
    setFavorites((prev) =>
      prev.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase())
    );
  }, []);

  const isFavorite = useCallback(
    (cityName: string) =>
      favorites.some((f) => f.name.toLowerCase() === cityName.toLowerCase()),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
