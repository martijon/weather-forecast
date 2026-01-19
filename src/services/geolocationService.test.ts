import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentPosition } from './geolocationService';

describe('geolocationService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getCurrentPosition', () => {
    it('should return coordinates when geolocation succeeds', async () => {
      const mockPosition = {
        coords: {
          latitude: 42.6977,
          longitude: 23.3219,
        },
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => success(mockPosition)),
      };

      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      const result = await getCurrentPosition();

      expect(result).toEqual({
        lat: 42.6977,
        lon: 23.3219,
      });
    });

    it('should reject when geolocation is not supported', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        writable: true,
      });

      await expect(getCurrentPosition()).rejects.toThrow(
        'Geolocation is not supported by your browser'
      );
    });

    it('should reject with permission denied error', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) =>
          error({ code: 1, PERMISSION_DENIED: 1 })
        ),
      };

      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      await expect(getCurrentPosition()).rejects.toThrow(
        'Location permission denied'
      );
    });

    it('should reject with position unavailable error', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) =>
          error({ code: 2, POSITION_UNAVAILABLE: 2 })
        ),
      };

      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      await expect(getCurrentPosition()).rejects.toThrow(
        'Location information is unavailable'
      );
    });

    it('should reject with timeout error', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) =>
          error({ code: 3, TIMEOUT: 3 })
        ),
      };

      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      await expect(getCurrentPosition()).rejects.toThrow(
        'Location request timed out'
      );
    });
  });
});
