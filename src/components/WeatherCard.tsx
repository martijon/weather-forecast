import { useNavigate } from 'react-router-dom';
import type { DayForecast } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  forecast: DayForecast;
  isToday?: boolean;
}

export const WeatherCard = ({ forecast, isToday = false }: WeatherCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/day/${forecast.dateKey}`, { state: { day: forecast } });
  };

  return (
    <div
      className={`${styles.card} ${isToday ? styles.cardToday : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.header}>
        <span className={styles.day}>{isToday ? 'Today' : forecast.dayName}</span>
        <span className={styles.date}>
          {forecast.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      <img
        src={getWeatherIconUrl(forecast.icon)}
        alt={forecast.description}
        className={styles.icon}
        loading="lazy"
      />
      
      <div className={styles.temp}>
        <span className={styles.tempMain}>{Math.round(forecast.temp)}°C</span>
        <div className={styles.tempRange}>
          <span className={styles.tempHigh}>H: {Math.round(forecast.tempMax)}°</span>
          <span className={styles.tempLow}>L: {Math.round(forecast.tempMin)}°</span>
        </div>
      </div>
      
      <p className={styles.description}>{forecast.description}</p>
      
      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Humidity</span>
          <span className={styles.detailValue}>{forecast.humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Wind</span>
          <span className={styles.detailValue}>{forecast.wind.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
};
