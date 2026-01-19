# Weather Map

A modern React weather application that displays a 5-day forecast with hourly details. Built with React 19, TypeScript, and Vite.

## Features

- **5-Day Weather Forecast** - View weather predictions for the next 5 days
- **Hourly Details** - Click on any day to see detailed hourly forecasts
- **City Search** - Search for weather in any city worldwide
- **Geolocation** - Automatically detects your location on first load
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI** - Glassmorphism design with smooth animations

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **CSS Modules** - Scoped component styling
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)
- **OpenWeatherMap API Key** - [Get one free here](https://openweathermap.org/api)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/martijon/weather-map.git
cd weather-map
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

> **Note:** Get your free API key from [OpenWeatherMap](https://openweathermap.org/api). The free tier allows 1,000 API calls per day.

## Running the App

### Development Server

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Production Build

```bash
npm run build
```

Creates optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Testing

### Run All Tests

```bash
npm test
```

Runs tests in watch mode.

### Run Tests Once

```bash
npm run test -- --run
```

### Run Tests with UI

```bash
npm run test:ui
```

Opens Vitest UI for interactive test exploration.

### Run Tests with Coverage

```bash
npm run test:coverage
```

Generates code coverage report.

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchBar.tsx
│   ├── SearchBar.module.css
│   ├── WeatherCard.tsx
│   ├── WeatherCard.module.css
│   ├── ForecastList.tsx
│   ├── ForecastList.module.css
│   ├── WeatherForecast.tsx
│   └── WeatherForecast.module.css
├── pages/               # Route pages
│   ├── DayDetails.tsx
│   └── DayDetails.module.css
├── services/            # API and business logic
│   ├── weatherService.ts
│   ├── weatherService.test.ts
│   ├── geolocationService.ts
│   └── geolocationService.test.ts
├── types/               # TypeScript types
│   └── weather.ts
├── test/                # Test setup
│   └── setup.ts
├── App.tsx              # Main app with routing
├── App.css              # Global styles
└── main.tsx             # Entry point
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage |

## API Reference

This app uses the [OpenWeatherMap API](https://openweathermap.org/api):

- **5 Day / 3 Hour Forecast** - Weather predictions
- **Geocoding API** - City name to coordinates
- **Reverse Geocoding** - Coordinates to city name

## License

MIT
