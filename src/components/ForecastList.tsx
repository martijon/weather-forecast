import type { DayForecast } from '../types/weather';
import { WeatherCard } from './WeatherCard';
import { useFavorites } from '../context/FavoritesContext';
import styles from './ForecastList.module.css';

interface ForecastListProps {
  forecasts: DayForecast[];
  cityName: string;
  country: string;
}

export const ForecastList = ({ forecasts, cityName, country }: ForecastListProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isCityFavorite = isFavorite(cityName);

  const handleToggleFavorite = () => {
    if (isCityFavorite) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName, country);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>
          5-Day Forecast for {cityName}, {country}
        </h2>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`${styles.favoriteButton} ${isCityFavorite ? styles.favorited : ''}`}
          title={isCityFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isCityFavorite ? '★' : '☆'}
        </button>
      </div>
      <p className={styles.subtitle}>Click on a day to see hourly details</p>
      <div className={styles.grid}>
        {forecasts.map((forecast, index) => (
          <WeatherCard
            key={forecast.dateKey}
            forecast={forecast}
            isToday={index === 0}
          />
        ))}
      </div>
    </div>
  );
};
