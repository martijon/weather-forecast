import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeatherForecast } from './components/WeatherForecast';
import { DayDetails } from './pages/DayDetails';
import { FavoritesProvider } from './context/FavoritesContext';
import './App.css';

const App = () => (
  <FavoritesProvider>
  <BrowserRouter>
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="app-header">
                <h1>🌤️ Weather Forecast</h1>
                <p>Get the 5-day weather forecast for any city</p>
              </header>
              <main className="app-main">
                <WeatherForecast />
              </main>
              <footer className="app-footer">
                <p>Powered by OpenWeatherMap API</p>
              </footer>
            </>
          }
        />
        <Route path="/day/:dateKey" element={<DayDetails />} />
      </Routes>
    </div>
  </BrowserRouter>
  </FavoritesProvider>
);

export default App;
