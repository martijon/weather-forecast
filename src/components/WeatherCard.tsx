import type { DayForecast } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';

interface WeatherCardProps {
  forecast: DayForecast;
  isToday?: boolean;
}

export const WeatherCard = ({ forecast, isToday = false }: WeatherCardProps) => {
  return (
    <div className={`weather-card ${isToday ? 'weather-card-today' : ''}`}>
      <div className="weather-card-header">
        <span className="weather-day">{isToday ? 'Today' : forecast.dayName}</span>
        <span className="weather-date">
          {forecast.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      <img
        src={getWeatherIconUrl(forecast.icon)}
        alt={forecast.description}
        className="weather-icon"
      />
      
      <div className="weather-temp">
        <span className="temp-main">{Math.round(forecast.temp)}°C</span>
        <div className="temp-range">
          <span className="temp-high">H: {Math.round(forecast.tempMax)}°</span>
          <span className="temp-low">L: {Math.round(forecast.tempMin)}°</span>
        </div>
      </div>
      
      <p className="weather-description">{forecast.description}</p>
      
      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{forecast.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{forecast.wind.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
};
