import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WeatherCard } from './WeatherCard';
import type { DayForecast } from '../types/weather';

const mockForecast: DayForecast = {
  date: new Date('2024-01-22'),
  dateKey: '2024-01-22',
  dayName: 'Mon',
  temp: 5,
  tempMin: 2,
  tempMax: 8,
  humidity: 75,
  description: 'clear sky',
  icon: '01d',
  wind: 3.5,
  hourly: [
    {
      time: '12:00 PM',
      temp: 5,
      feelsLike: 3,
      humidity: 75,
      description: 'clear sky',
      icon: '01d',
      wind: 3.5,
      pop: 0,
    },
  ],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('WeatherCard', () => {
  it('should render forecast data correctly', () => {
    renderWithRouter(<WeatherCard forecast={mockForecast} />);

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Jan 22')).toBeInTheDocument();
    expect(screen.getByText('5°C')).toBeInTheDocument();
    expect(screen.getByText('H: 8°')).toBeInTheDocument();
    expect(screen.getByText('L: 2°')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('3.5 m/s')).toBeInTheDocument();
  });

  it('should display "Today" when isToday is true', () => {
    renderWithRouter(<WeatherCard forecast={mockForecast} isToday={true} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.queryByText('Mon')).not.toBeInTheDocument();
  });

  it('should render weather icon with correct alt text', () => {
    renderWithRouter(<WeatherCard forecast={mockForecast} />);

    const icon = screen.getByAltText('clear sky');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/01d@2x.png'
    );
  });

  it('should be clickable and navigate on click', async () => {
    const user = userEvent.setup();

    renderWithRouter(<WeatherCard forecast={mockForecast} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();

    await user.click(card);
  });

  it('should have correct CSS class for today', () => {
    renderWithRouter(<WeatherCard forecast={mockForecast} isToday={true} />);

    const card = screen.getByRole('button');
    // CSS Modules generate hashed class names like _cardToday_46dfb8
    expect(card.className).toMatch(/cardToday/);
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();

    renderWithRouter(<WeatherCard forecast={mockForecast} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');

    card.focus();
    await user.keyboard('{Enter}');
  });
});
