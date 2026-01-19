import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCoordinatesByCity,
  getForecast,
  processForecastData,
  getWeatherIconUrl,
  getCityByCoordinates,
} from './weatherService';
import type { ForecastResponse } from '../types/weather';

describe('weatherService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getCoordinatesByCity', () => {
    it('should return coordinates for a valid city', async () => {
      const mockResponse = [
        { lat: 42.6977, lon: 23.3219, name: 'Sofia', country: 'BG' },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getCoordinatesByCity('Sofia', 'test-api-key');

      expect(result).toEqual({
        lat: 42.6977,
        lon: 23.3219,
        name: 'Sofia',
        country: 'BG',
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('Sofia')
      );
    });

    it('should return null for a city not found', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await getCoordinatesByCity('NonExistentCity', 'test-api-key');

      expect(result).toBeNull();
    });

    it('should throw error on API failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid API key' }),
      });

      await expect(getCoordinatesByCity('Sofia', 'invalid-key')).rejects.toThrow(
        'Invalid API key'
      );
    });
  });

  describe('getForecast', () => {
    it('should return forecast data for valid coordinates', async () => {
      const mockForecast: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [],
        city: {
          id: 727011,
          name: 'Sofia',
          coord: { lat: 42.6977, lon: 23.3219 },
          country: 'BG',
          timezone: 7200,
          sunrise: 1234567890,
          sunset: 1234567890,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockForecast),
      });

      const result = await getForecast(42.6977, 23.3219, 'test-api-key');

      expect(result).toEqual(mockForecast);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=42.6977')
      );
    });

    it('should throw error on API failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      });

      await expect(getForecast(42.6977, 23.3219, 'test-key')).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('processForecastData', () => {
    it('should process forecast data into daily forecasts', () => {
      const mockData: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 3,
        list: [
          {
            dt: 1705924800, // 2024-01-22 12:00
            main: {
              temp: 5,
              feels_like: 3,
              temp_min: 4,
              temp_max: 6,
              pressure: 1013,
              humidity: 80,
            },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.5, deg: 180 },
            visibility: 10000,
            pop: 0,
            dt_txt: '2024-01-22 12:00:00',
          },
          {
            dt: 1705935600, // 2024-01-22 15:00
            main: {
              temp: 7,
              feels_like: 5,
              temp_min: 6,
              temp_max: 8,
              pressure: 1013,
              humidity: 75,
            },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 4.0, deg: 200 },
            visibility: 10000,
            pop: 0.1,
            dt_txt: '2024-01-22 15:00:00',
          },
          {
            dt: 1706011200, // 2024-01-23 12:00
            main: {
              temp: 3,
              feels_like: 1,
              temp_min: 2,
              temp_max: 4,
              pressure: 1010,
              humidity: 85,
            },
            weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
            clouds: { all: 80 },
            wind: { speed: 5.0, deg: 220 },
            visibility: 8000,
            pop: 0.6,
            dt_txt: '2024-01-23 12:00:00',
          },
        ],
        city: {
          id: 727011,
          name: 'Sofia',
          coord: { lat: 42.6977, lon: 23.3219 },
          country: 'BG',
          timezone: 7200,
          sunrise: 1234567890,
          sunset: 1234567890,
        },
      };

      const result = processForecastData(mockData);

      expect(result).toHaveLength(2);
      expect(result[0].hourly).toHaveLength(2);
      expect(result[1].hourly).toHaveLength(1);
      expect(result[0].tempMin).toBe(4);
      expect(result[0].tempMax).toBe(8);
    });

    it('should return at most 5 days', () => {
      const mockData: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: Array.from({ length: 40 }, (_, i) => ({
          dt: 1705924800 + i * 10800, // Every 3 hours
          main: {
            temp: 5 + i,
            feels_like: 3 + i,
            temp_min: 4 + i,
            temp_max: 6 + i,
            pressure: 1013,
            humidity: 80,
          },
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3.5, deg: 180 },
          visibility: 10000,
          pop: 0,
          dt_txt: `2024-01-${22 + Math.floor(i / 8)} ${(i * 3) % 24}:00:00`,
        })),
        city: {
          id: 727011,
          name: 'Sofia',
          coord: { lat: 42.6977, lon: 23.3219 },
          country: 'BG',
          timezone: 7200,
          sunrise: 1234567890,
          sunset: 1234567890,
        },
      };

      const result = processForecastData(mockData);

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getWeatherIconUrl', () => {
    it('should return correct icon URL', () => {
      const url = getWeatherIconUrl('01d');
      expect(url).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('should handle different icon codes', () => {
      const url = getWeatherIconUrl('10n');
      expect(url).toBe('https://openweathermap.org/img/wn/10n@2x.png');
    });
  });

  describe('getCityByCoordinates', () => {
    it('should return city info for valid coordinates', async () => {
      const mockResponse = [{ name: 'Sofia', country: 'BG' }];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getCityByCoordinates(42.6977, 23.3219, 'test-api-key');

      expect(result).toEqual({ name: 'Sofia', country: 'BG' });
    });

    it('should return null when no city found', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await getCityByCoordinates(0, 0, 'test-api-key');

      expect(result).toBeNull();
    });
  });
});
