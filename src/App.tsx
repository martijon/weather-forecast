import { WeatherForecast } from './components/WeatherForecast';
import './App.css';

const App = () => (
    <div className="app">
        <header className="app-header">
            <h1>🌤️ Weather Forecast</h1>
            <p>Get the 5-day weather forecast for any city</p>
        </header>

        <main className="app-main">
            <WeatherForecast/>
        </main>

        <footer className="app-footer">
            <p>Powered by OpenWeatherMap API</p>
        </footer>
    </div>
);

export default App;
