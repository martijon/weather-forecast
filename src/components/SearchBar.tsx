import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [city, setCity] = useState('');

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
    </form>
  );
};
