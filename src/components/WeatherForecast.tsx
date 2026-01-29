import { useState, useEffect, useCallback } from 'react';
import type { DayForecast } from '../types/weather';
import { SearchBar } from './SearchBar';
import { ForecastList } from './ForecastList';
import { FavoritesList } from './FavoritesList';
import {
  getCoordinatesByCity,
  getForecast,
  processForecastData,
  getCityByCoordinates,
} from '../services/weatherService';
import { getCurrentPosition } from '../services/geolocationService';
import styles from './WeatherForecast.module.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export const WeatherForecast = () => {
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [cityInfo, setCityInfo] = useState<{ name: string; country: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadForecastByCoordinates = useCallback(async (lat: number, lon: number) => {
    if (!API_KEY) {
      setError('Please set your OpenWeatherMap API key in .env file (VITE_OPENWEATHER_API_KEY)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [forecastData, cityData] = await Promise.all([
        getForecast(lat, lon, API_KEY),
        getCityByCoordinates(lat, lon, API_KEY),
      ]);

      const processedData = processForecastData(forecastData);
      setForecasts(processedData);
      setCityInfo(cityData || { name: 'Your Location', country: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadCurrentLocationForecast = async () => {
      try {
        const position = await getCurrentPosition();
        await loadForecastByCoordinates(position.lat, position.lon);
      } catch (err) {
        console.log('Geolocation unavailable, falling back to manual search:', err);
      }
      setIsInitialLoad(false);
    };

    loadCurrentLocationForecast().then();
  }, [loadForecastByCoordinates]);

  const handleSearch = async (city: string) => {
    if (!API_KEY) {
      setError('Please set your OpenWeatherMap API key in .env file (VITE_OPENWEATHER_API_KEY)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCoordinatesByCity(city, API_KEY);

      if (!coords) {
        setError(`City "${city}" not found. Please try another city.`);
        setForecasts([]);
        setCityInfo(null);
        return;
      }

      const forecastData = await getForecast(coords.lat, coords.lon, API_KEY);
      const processedData = processForecastData(forecastData);

      setForecasts(processedData);
      setCityInfo({ name: coords.name, country: coords.country });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      <FavoritesList onSelectCity={handleSearch} />

      {error && <div className={styles.errorMessage}>{error}</div>}

      {forecasts.length > 0 && cityInfo && (
        <ForecastList
          forecasts={forecasts}
          cityName={cityInfo.name}
          country={cityInfo.country}
        />
      )}

      {!error && forecasts.length === 0 && !isLoading && !isInitialLoad && (
        <div className={styles.emptyState}>
          <p>Enter a city name to see the weather forecast</p>
        </div>
      )}

      {isInitialLoad && (
        <div className={styles.emptyState}>
          <p>📍 Getting your location...</p>
        </div>
      )}
    </>
  );
};
