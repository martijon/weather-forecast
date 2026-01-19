import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { DayForecast } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';

export const DayDetails = () => {
  useParams<{ dateKey: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const day = location.state?.day as DayForecast | undefined;

  if (!day) {
    return (
      <div className="day-details-page">
        <div className="day-details-error">
          <p>Forecast data not found. Please go back and select a day.</p>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Forecast
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="day-details-page">
      <header className="day-details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="day-details-title">
          <h1>{day.dayName}, {day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h1>
          <p className="day-details-summary">
            <img src={getWeatherIconUrl(day.icon)} alt={day.description} className="day-summary-icon" />
            <span>{Math.round(day.temp)}°C • {day.description}</span>
          </p>
        </div>
      </header>

      <main className="day-details-content">
        <div className="day-overview">
          <div className="overview-card">
            <span className="overview-label">High</span>
            <span className="overview-value temp-high">{Math.round(day.tempMax)}°C</span>
          </div>
          <div className="overview-card">
            <span className="overview-label">Low</span>
            <span className="overview-value temp-low">{Math.round(day.tempMin)}°C</span>
          </div>
          <div className="overview-card">
            <span className="overview-label">Humidity</span>
            <span className="overview-value">{day.humidity}%</span>
          </div>
          <div className="overview-card">
            <span className="overview-label">Wind</span>
            <span className="overview-value">{day.wind.toFixed(1)} m/s</span>
          </div>
        </div>

        <section className="hourly-section">
          <h2>Hourly Forecast</h2>
          <div className="hourly-grid">
            {day.hourly.map((hour, index) => (
              <div key={index} className="hourly-card">
                <span className="hourly-time">{hour.time}</span>
                <img
                  src={getWeatherIconUrl(hour.icon)}
                  alt={hour.description}
                  className="hourly-icon"
                />
                <span className="hourly-temp">{Math.round(hour.temp)}°</span>
                <span className="hourly-desc">{hour.description}</span>
                <div className="hourly-stats">
                  <span title="Feels like">🌡️ {Math.round(hour.feelsLike)}°</span>
                  <span title="Humidity">💧 {hour.humidity}%</span>
                  <span title="Wind">💨 {hour.wind.toFixed(1)} m/s</span>
                  <span title="Precipitation">🌧️ {hour.pop}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
