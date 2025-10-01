<script setup>
import { ref, reactive, computed } from 'vue'
import { convertWeatherData } from './weatherDataConverter.js'

// Selected city state
const selectedCity = ref('San Francisco')
const cityWeatherDataSet = reactive(new Map());

const updateCityWeatherConditions = (cityName) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      // Get daily forecast (every 24 hours = every 8th item)
      const dailyForecasts = data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      if (dailyForecasts.length === 0) {
        alert("No forecast data available for the next 5 days.");
        return;
      }
      const cityKey = data.city.name.toLowerCase();
      const weatherData = convertWeatherData(data);
      console.log("Converted Weather Data:", weatherData);
      // Store the weather data for this city
      cityWeatherDataSet.set(cityName, weatherData[cityKey]);
      // console.log(cityWeatherDataSet);
      // return weatherData;
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching weather data.");
    });
    return;
};


// Pre-fetch weather data for all cities
updateCityWeatherConditions('San Francisco');
updateCityWeatherConditions('Boston');
updateCityWeatherConditions('Seattle');
updateCityWeatherConditions('Chicago');
updateCityWeatherConditions('New York');

const curCityWeatherData = computed(() => cityWeatherDataSet.get(selectedCity.value) || null)
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white/90 shadow-sm border-b border-gray-200 px-3 sm:px-28 py-6 relative z-10">
      <div class="flex items-center justify-between gap-4 sm:gap-25 flex-wrap">
        <div class="flex items-center min-w-60">
          <img src="../src/assets/cloud_song_logo.png" alt="Cloud Song logo"
            class="w-15 h-15 rounded-full object-cover" />
          <div class="ml-3 max-w-96">
            <h1 class="font-limelight text-3xl text-gray-800 leading-tight">Cloud Song</h1>
            <p class="font-inter text-base text-gray-600">Where music bridges, love reaches</p>
          </div>
        </div>
        <div class="text-right flex flex-col items-end">
          <p class="font-nimbus text-base text-gray-800 font-medium">Made for grandparents</p>
          <p class="text-pink-500 text-sm font-inter font-medium">With Love ❤️</p>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative min-h-[600px] bg-white">
      <div class="max-w-7xl mx-auto px-8 relative min-h-[600px] overflow-hidden">
        <img src="../src/assets/guzheng_girl.png" alt="Girl playing guzheng by the window with city skyline"
          class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div class="relative z-10 flex items-center justify-center min-h-[600px]">
          <div id="hero-content" class="text-center max-w-md mx-auto">
            <h2 class="font-nimbus text-5xl font-bold text-white leading-none mb-6">Cloud Song</h2>
            <p class="font-nimbus text-xl text-white max-w-sm mx-auto leading-relaxed">
              Where music bridges, love reaches
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-8 py-12 w-full" style="background: linear-gradient(to bottom right, #F3F7FA, #A5B2C5);">
      <!-- City Selection -->
      <section class="mb-8">
        <h3 class="font-nimbus text-3xl font-bold text-gray-800 text-center mb-6">
          Select a U.S. City
        </h3>


        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- San Francisco -->
          <button
            @click="selectedCity = 'San Francisco'"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
               selectedCity === 'San Francisco'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-lg',
            ]"
          >
            <div class="text-4xl mb-3">🌉</div>
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">San Francisco</h4>
            <p class="font-nimbus text-base text-gray-600">California</p>
          </button>

          <!-- Boston -->
          <button
            @click="selectedCity = 'Boston'"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'Boston'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <img src="../src/assets/boston.png" alt="Boston" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Boston</h4>
            <p class="font-nimbus text-base text-gray-600">Massachusetts</p>
          </button>

          <!-- Seattle -->
          <button
            @click="selectedCity = 'Seattle'"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'Seattle'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <img src="../src/assets/mountain.png" alt="Seattle" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Seattle</h4>
            <p class="font-nimbus text-base text-gray-600">Washington</p>
          </button>

          <!-- Chicago -->
          <button
            @click="selectedCity = 'Chicago'"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'Chicago'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <img src="../src/assets/city.png" alt="Chicago" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Chicago</h4>
            <p class="font-nimbus text-base text-gray-600">Illinois</p>
          </button>

          <!-- New York -->
          <button
            @click="selectedCity = 'New York'"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'New York'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <div class="text-4xl mb-3">🗽</div>
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">New York</h4>
            <p class="font-nimbus text-base text-gray-600">New York</p>
          </button>
        </div>
      </section>

      <!-- Weather Display -->
      <section class="bg-white rounded-3xl border-4 border-l-4 border-gray-200 p-11">
        <div class="text-center mb-8">
          <h3 class="font-nimbus text-4xl font-bold text-gray-800 mb-2">{{ curCityWeatherData?.name || selectedCity }} Weather</h3>
          <p class="font-nimbus text-lg text-gray-600">{{ curCityWeatherData?.location || 'Location' }}</p>
        </div>

        <!-- Current Weather -->
        <div class="bg-blue-50 rounded-3xl border border-blue-200 p-8 mb-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Main Weather Info -->
            <div class="text-center">
              <img src="../src/assets/sunny.png" alt="Sunny weather" class="w-29 h-28 object-contain mx-auto mb-4" />
              <div class="font-nimbus text-6xl font-bold text-gray-800 mb-4">{{ curCityWeatherData?.weather?.temperature }}</div>
              <div class="font-nimbus text-3xl font-medium text-gray-700 mb-4">{{ curCityWeatherData?.weather?.condition }}</div>
              <div class="font-nimbus text-lg text-gray-600">{{ curCityWeatherData?.weather?.description }}</div>
            </div>

            <!-- Weather Details -->
            <div class="space-y-4">
              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">🌡️</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Feels Like</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ curCityWeatherData?.weather?.feelsLike }}</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-5">💧</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Humidity</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ curCityWeatherData?.weather?.humidity }}</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">💨</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Wind Speed</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ curCityWeatherData?.weather?.windSpeed }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Day Forecast -->
        <div class="mb-8">
          <h4 class="font-nimbus text-3xl font-bold text-gray-800 text-center mb-6">
            5-Day Forecast
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div 
              v-for="(forecast, index) in (curCityWeatherData?.forecast || []).slice(0, 5)" 
              :key="index"
              class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center"
            >
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">{{ forecast.day }}</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">{{ forecast.date }}</p>
              <div class="text-4xl mb-2">{{ forecast.icon }}</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ forecast.temperature }}</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">{{ forecast.condition }}</div>
              <div class="font-nimbus text-xs text-gray-500">{{ forecast.range }}</div>
            </div>
            
            <!-- Fallback static forecast cards if no data -->
            <template v-if="!curCityWeatherData?.forecast || curCityWeatherData.forecast.length === 0">
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
                <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Today</h5>
                <p class="font-nimbus text-sm text-gray-600 mb-2">Loading...</p>
                <div class="text-4xl mb-2">☀️</div>
                <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">--°F</div>
                <div class="font-nimbus text-sm text-gray-600 mb-1">Loading</div>
                <div class="font-nimbus text-xs text-gray-500">H: --° L: --°</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="text-center text-gray-500">
          <p class="font-nimbus text-base mb-1">Last Updated: December 30, 2025 at 10:30 AM PST</p>
          <p class="font-nimbus text-sm text-gray-400">Data refreshed every 15 minutes</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white/90 border-t border-gray-200 px-28 py-8">
      <div class="text-center">
        <div class="flex items-center justify-center mb-4">
          <span class="text-xl mr-2">🎵</span>
          <span class="font-nimbus text-lg font-medium text-gray-700">Where music bridges, love reaches</span>
          <span class="text-xl ml-2">❤️</span>
        </div>
        <p class="font-nimbus text-base text-gray-500">
          Cloud Song © 2025 · Made with love for grandparents
        </p>
      </div>
    </footer>

    <!-- Music Player -->
    <div class="bg-white/95 shadow-2xl border-t border-gray-200 px-8 py-6 backdrop-blur-sm">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Song Info -->
        <div class="flex items-center flex-1 min-w-0">
          <div class="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0">
            <img src="../src/assets/music.png" alt="Album cover" class="w-full h-full object-cover" />
          </div>
          <div class="ml-4 min-w-0 flex-1">
            <h4 class="font-nimbus text-lg font-bold text-gray-800 truncate">
              Spring River Flower Moon Night
            </h4>
            <p class="font-nimbus text-base text-gray-600 truncate">Traditional Guzheng Music</p>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center space-x-6 mx-6">
          <button
            class="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors">
            <img src="../src/assets/previous.png" alt="Previous" class="w-7 h-7 object-contain" />
          </button>
          <button
            class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
            <img src="../src/assets/play.png" alt="Play" class="w-8 h-8 object-contain" />
          </button>
          <button
            class="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors">
            <img src="../src/assets/next.png" alt="Next" class="w-8 h-8 object-contain" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="flex-1 max-w-80">
          <div class="bg-gray-200 rounded-full h-2 mb-1">
            <div class="bg-gray-400 h-2 rounded-full" style="width: 35%"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 font-nimbus">
            <span>1:24</span>
            <span>3:45</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
