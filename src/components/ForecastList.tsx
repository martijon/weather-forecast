import type { DayForecast } from '../types/weather';
import { WeatherCard } from './WeatherCard';

interface ForecastListProps {
  forecasts: DayForecast[];
  cityName: string;
  country: string;
}

export const ForecastList = ({ forecasts, cityName, country }: ForecastListProps) => {
  return (
    <div className="forecast-container">
      <h2 className="forecast-title">
        5-Day Forecast for {cityName}, {country}
      </h2>
      <div className="forecast-grid">
        {forecasts.map((forecast, index) => (
          <WeatherCard
            key={forecast.date.toISOString()}
            forecast={forecast}
            isToday={index === 0}
          />
        ))}
      </div>
    </div>
  );
};
