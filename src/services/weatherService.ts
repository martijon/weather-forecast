import type { ForecastResponse, DayForecast } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';

export const getCoordinatesByCity = async (
  city: string,
  apiKey: string
): Promise<{ lat: number; lon: number; name: string; country: string } | null> => {
  const response = await fetch(
    `${GEO_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Geocoding API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.length === 0) {
    return null;
  }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
};

export const getForecast = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<ForecastResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Weather API error: ${response.status}`);
  }
  
  return response.json();
};

export const processForecastData = (data: ForecastResponse): DayForecast[] => {
  const dailyMap = new Map<string, DayForecast>();
  
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: item.main.temp,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind: item.wind.speed,
      });
    } else {
      const existing = dailyMap.get(dateKey)!;
      existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
      existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
      
      // Use midday forecast for main display if available
      const hour = date.getHours();
      if (hour >= 11 && hour <= 14) {
        existing.temp = item.main.temp;
        existing.description = item.weather[0].description;
        existing.icon = item.weather[0].icon;
        existing.humidity = item.main.humidity;
        existing.wind = item.wind.speed;
      }
    }
  });
  
  return Array.from(dailyMap.values()).slice(0, 5);
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getCityByCoordinates = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<{ name: string; country: string } | null> => {
  const response = await fetch(
    `${GEO_API_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Reverse geocoding error: ${response.status}`);
  }

  const data = await response.json();

  if (data.length === 0) {
    return null;
  }

  return {
    name: data[0].name,
    country: data[0].country,
  };
};
