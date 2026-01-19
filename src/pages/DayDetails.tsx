import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { DayForecast } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherService';
import styles from './DayDetails.module.css';

export const DayDetails = () => {
  useParams<{ dateKey: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const day = location.state?.day as DayForecast | undefined;

  if (!day) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>Forecast data not found. Please go back and select a day.</p>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            ← Back to Forecast
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className={styles.title}>
          <h1>{day.dayName}, {day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h1>
          <p className={styles.summary}>
            <img src={getWeatherIconUrl(day.icon)} alt={day.description} className={styles.summaryIcon} />
            <span>{Math.round(day.temp)}°C • {day.description}</span>
          </p>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.overview}>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>High</span>
            <span className={`${styles.overviewValue} ${styles.tempHigh}`}>{Math.round(day.tempMax)}°C</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Low</span>
            <span className={`${styles.overviewValue} ${styles.tempLow}`}>{Math.round(day.tempMin)}°C</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Humidity</span>
            <span className={styles.overviewValue}>{day.humidity}%</span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewLabel}>Wind</span>
            <span className={styles.overviewValue}>{day.wind.toFixed(1)} m/s</span>
          </div>
        </div>

        <section className={styles.hourlySection}>
          <h2>Hourly Forecast</h2>
          <div className={styles.hourlyGrid}>
            {day.hourly.map((hour, index) => (
              <div key={index} className={styles.hourlyCard}>
                <span className={styles.hourlyTime}>{hour.time}</span>
                <img
                  src={getWeatherIconUrl(hour.icon)}
                  alt={hour.description}
                  className={styles.hourlyIcon}
                />
                <span className={styles.hourlyTemp}>{Math.round(hour.temp)}°</span>
                <span className={styles.hourlyDesc}>{hour.description}</span>
                <div className={styles.hourlyStats}>
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
