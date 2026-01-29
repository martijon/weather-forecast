import { useState } from 'react';
import type { FormEvent } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  currentCity?: { name: string; country: string } | null;
}

export const SearchBar = ({ onSearch, isLoading, currentCity }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isCurrentCityFavorite = currentCity ? isFavorite(currentCity.name) : false;

  const handleToggleFavorite = () => {
    if (!currentCity) return;
    if (isCurrentCityFavorite) {
      removeFavorite(currentCity.name);
    } else {
      addFavorite(currentCity.name, currentCity.country);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBar}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        disabled={isLoading}
        className={styles.input}
      />
      <button type="submit" disabled={isLoading || !city.trim()} className={styles.button}>
        {isLoading ? 'Loading...' : 'Search'}
      </button>
      {currentCity && (
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`${styles.favoriteButton} ${isCurrentCityFavorite ? styles.favorited : ''}`}
          title={isCurrentCityFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isCurrentCityFavorite ? '★' : '☆'}
        </button>
      )}
    </form>
  );
};
