# 🌤️ Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the Open-Meteo API (free, no API key required).

## ✨ Features

- **Current Weather**: Real-time temperature, humidity, wind speed, pressure, visibility
- **5-Day Forecast**: Daily weather predictions with high/low temperatures
- **Hourly Forecast**: Hour-by-hour weather for the next 24 hours
- **Search by City**: Find weather for any city worldwide
- **Geolocation**: Auto-detect your current location
- **Search History**: Recently searched cities stored locally
- **Sunrise/Sunset**: Daily sunrise and sunset times
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Beautiful gradient background
- **Real-time Updates**: Always shows current weather data

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Responsive design with gradients and animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **Open-Meteo API**: Free weather data (no API key needed)
- **Geocoding API**: City name to coordinates conversion
- **LocalStorage**: For search history persistence

## 📍 APIs Used

### Open-Meteo API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Features**: Current weather, 5-day forecast, hourly forecast
- **Free**: Yes, no API key required
- **Rate Limit**: Generous for personal use

### Geocoding API
- **URL**: `https://geocoding-api.open-meteo.com/v1/search`
- **Features**: City search and coordinates lookup
- **Free**: Yes

## 🚀 How to Use

1. **Clone the repository**:
   ```bash
   git clone https://github.com/juminokentok99-lab/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - No installation or build process needed

3. **Search for a city**:
   - Type city name in search box
   - Press Enter or click Search button
   - View weather data and forecast

4. **Use current location**:
   - Click the location button (pin icon)
   - Allow browser permission for geolocation
   - Weather for your location will load

5. **View recent searches**:
   - Recently searched cities appear at the bottom
   - Click any city to view its weather again

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select `main` branch as source
4. Save and wait for deployment
5. Your site will be live at: `https://yourusername.github.io/weather-dashboard/`

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🎨 Color Scheme

- **Primary**: #667eea (Purple)
- **Secondary**: #764ba2 (Dark Purple)
- **Success**: #48dbfb (Light Blue)
- **Background**: Linear gradient (Purple to Dark Purple)

## 📊 Weather Data Displayed

### Current Weather
- Temperature (°C)
- "Feels like" temperature
- Weather condition
- Humidity
- Wind speed
- Atmospheric pressure
- Visibility
- Sunrise/Sunset times
- High/Low temperatures

### Forecast
- 5-day daily forecast
- 24-hour hourly forecast
- Weather icons for each condition
- Temperature ranges

## 🔒 Privacy

- No API keys stored in code
- No user tracking
- Geolocation only used with explicit permission
- Search history stored locally in browser

## 🐛 Troubleshooting

### Weather data not loading?
- Check internet connection
- Verify city name spelling
- Try using geolocation instead
- Check browser console for errors

### Geolocation not working?
- Check browser permissions
- Ensure HTTPS (some browsers require it)
- Try a different browser

### Search suggestions not appearing?
- Type at least 2 characters
- Check internet connection
- Verify city name

## 📁 File Structure

```
weather-dashboard/
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 📄 License

Free to use and modify for personal projects.

## 🚀 Future Enhancements

- [ ] Air quality index
- [ ] Weather alerts
- [ ] Multiple language support
- [ ] Temperature unit toggle (°C/°F)
- [ ] Weather maps
- [ ] UV index
- [ ] Pollen count
- [ ] PWA (Progressive Web App) support

## 💬 Support

If you encounter any issues, please open an issue on GitHub.

---

**Made with ❤️ by Kelompok Ebook 838 Bulu**