import type { DayForecast } from '../types/weather';
import { WeatherCard } from './WeatherCard';
import styles from './ForecastList.module.css';

interface ForecastListProps {
  forecasts: DayForecast[];
  cityName: string;
  country: string;
}

export const ForecastList = ({ forecasts, cityName, country }: ForecastListProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        5-Day Forecast for {cityName}, {country}
      </h2>
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
