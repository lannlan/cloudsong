/**
 * Converts OpenWeatherMap API data to the custom weather format
 * @param {Object} apiData - The weather data from OpenWeatherMap API
 * @returns {Object} - Converted weather data in the desired format
 */
export function convertWeatherData(apiData) {
  // Helper function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return Math.round(celsius * 9/5 + 32);
  };

  // Helper function to convert m/s to mph
  const msToMph = (ms) => {
    return Math.round(ms * 2.237);
  };

  // Helper function to get weather icon emoji
  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '⛅', // '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return iconMap[weatherMain] || '🌤️';
  };

  // Helper function to get day name from timestamp
  const getDayName = (timestamp, index) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Helper function to get location string
  const getLocation = (city) => {
    // This is a simplified mapping - in reality, you'd want a more comprehensive mapping
    const stateMap = {
      'San Francisco': 'California, United States',
      'Boston': 'Massachusetts, United States',
      'Seattle': 'Washington, United States',
      'Chicago': 'Illinois, United States',
      'New York': 'New York, United States',
      'Los Angeles': 'California, United States'
    };
    return stateMap[city.name] || `${city.country}`;
  };

  // Get current weather (first item in the list)
  const currentWeather = apiData.list[0];
  const city = apiData.city;

  // Group forecast data by day (every 8th item represents a new day since data is every 3 hours)
  const dailyForecasts = [];
  const processedDays = new Set();
  
  for (let i = 0; i < apiData.list.length; i++) {
    const forecast = apiData.list[i];
    if (forecast) {
      const dateKey = new Date(forecast.dt * 1000).toDateString();
      if (!processedDays.has(dateKey) && dailyForecasts.length < 5) {
        processedDays.add(dateKey);
        
        // Find min/max temps for this day by looking at surrounding data points
        let minTemp = forecast.main.temp;
        let maxTemp = forecast.main.temp;

        for (let j = i; j < apiData.list.length; j++) {
          if (apiData.list[j]) {
            minTemp = Math.min(minTemp, apiData.list[j].main.temp_min);
            maxTemp = Math.max(maxTemp, apiData.list[j].main.temp_max);
          }
        }

        dailyForecasts.push({
          day: getDayName(forecast.dt, dailyForecasts.length),
          date: formatDate(forecast.dt),
          icon: getWeatherIcon(forecast.weather[0].main, forecast.weather[0].id),
          temperature: `${forecast.main.temp}°F`,
          condition: forecast.weather[0].main === 'Clouds' ? 
                    (forecast.weather[0].description.includes('scattered') ? 'Partly Cloudy' : 
                     forecast.weather[0].description.includes('overcast') ? 'Overcast' : 'Cloudy') : 
                    forecast.weather[0].main,
          range: `H: ${maxTemp}C° L: ${minTemp}°C`
        });
      }
    }
  }

  // Create the result object
  const cityKey = city.name.toLowerCase();
  const result = {
    [cityKey]: {
      name: city.name,
      location: getLocation(city),
      weather: {
        temperature: `${currentWeather.main.temp}°C`,
        condition: currentWeather.weather[0].main === 'Clouds' ? 
                  (currentWeather.weather[0].description.includes('scattered') ? 'Partly Cloudy' : 
                   currentWeather.weather[0].description.includes('overcast') ? 'Overcast' : 'Cloudy') : 
                  currentWeather.weather[0].main,
        description: currentWeather.weather[0].description.charAt(0).toUpperCase() + 
                    currentWeather.weather[0].description.slice(1),
        feelsLike: `${currentWeather.main.feels_like}°C`,
        humidity: `${currentWeather.main.humidity}%`,
        windSpeed: `${currentWeather.wind.speed} m/s`
      },
      forecast: dailyForecasts
    }
  };

  return result;
}

// Export the function for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = convertWeatherData;
}

// Example usage:
// const convertedData = convertWeatherData(exampleApiData);
// console.log(JSON.stringify(convertedData, null, 2));