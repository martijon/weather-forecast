import { useFavorites } from '../context/FavoritesContext';
import styles from './FavoritesList.module.css';

interface FavoritesListProps {
  onSelectCity: (city: string) => void;
}

export const FavoritesList = ({ onSelectCity }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Favorite Cities</h3>
      <div className={styles.list}>
        {favorites.map((city) => (
          <div key={city.name} className={styles.item}>
            <button
              className={styles.cityButton}
              onClick={() => onSelectCity(city.name)}
            >
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.country}>{city.country}</span>
            </button>
            <button
              className={styles.removeButton}
              onClick={() => removeFavorite(city.name)}
              title="Remove from favorites"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
