<script setup>
import { ref, reactive } from 'vue'
import { convertWeatherData } from './weatherDataConverter.js'

// Selected city state
const selectedCity = ref('san francisco')
const cityData = reactive(new Map());

const getWeatherConditions = (city) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
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

      const weatherData = convertWeatherData(data);
      console.log("Converted Weather Data:", weatherData);
      cityData.set(city, weatherData);
      // return weatherData;
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching weather data.");
    });
    return;
};

// Pre-fetch weather data for all cities

//console.log(getWeatherConditions('San Francisco'));
// console.log(getWeatherConditions('Boston'));
// cityData.set('san francisco', getWeatherConditions('San Francisco'));
// cityData.set('boston', getWeatherConditions('Boston'));
// cityData.set('seattle', getWeatherConditions('Seattle'));
// cityData.set('chicago', getWeatherConditions('Chicago'));
// cityData.set('new york', getWeatherConditions('New York'));
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
    <section class="relative min-h-[600px] overflow-hidden bg-white">
      <img src="../src/assets/guzheng_girl.png" alt="Girl playing guzheng by the window with city skyline"
        class="absolute inset-0 w-full h-full object-cover" />``
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      <div class="relative z-10 flex items-center justify-center min-h-[600px] px-8 sm:px-16">
        <div id="hero-content" class="text-center max-w-md">
          <h2 class="font-nimbus text-5xl font-bold text-white leading-none mb-6">Cloud Song</h2>
          <p class="font-nimbus text-xl text-white max-w-sm mx-auto leading-relaxed">
            Where music bridges, love reaches
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-8 py-12 w-full">
      <!-- City Selection -->
      <section class="mb-8">
        <h3 class="font-nimbus text-3xl font-bold text-gray-800 text-center mb-6">
          Select a U.S. City
        </h3>


        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- San Francisco - Selected -->
          <button
            @click="selectedCity = 'san francisco'"
            :class="[
              'rounded-3xl border-2 border-pink-500 shadow-lg shadow-pink-200 bg-white p-6 text-center transition-all hover:shadow-xl',
               selectedCity === 'san francisco'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <div class="text-4xl mb-3">🌉</div>
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">San Francisco</h4>
            <p class="font-nimbus text-base text-gray-600">California</p>
          </button>

          <!-- Boston -->
          <button
            @click="selectedCity = 'boston'"
            :class="[
              'rounded-3xl border-2 border-gray-200 bg-white/90 p-6 text-center transition-all hover:shadow-lg',
              selectedCity === 'boston'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img src="../src/assets/boston.png" alt="Boston" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Boston</h4>
            <p class="font-nimbus text-base text-gray-600">Massachusetts</p>
          </button>

          <!-- Seattle -->
          <button
            @click="selectedCity = 'seattle'"
            :class="[
              'rounded-3xl border-2 border-gray-200 bg-white/90 p-6 text-center transition-all hover:shadow-lg',
              selectedCity === 'seattle'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img src="../src/assets/mountain.png" alt="Seattle" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Seattle</h4>
            <p class="font-nimbus text-base text-gray-600">Washington</p>
          </button>

          <!-- Chicago -->
          <button
            @click="selectedCity = 'chicago'"
            :class="[
              'rounded-3xl border-2 border-gray-200 bg-white/90 p-6 text-center transition-all hover:shadow-lg',
              selectedCity === 'chicago'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img src="../src/assets/city.png" alt="Chicago" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">Chicago</h4>
            <p class="font-nimbus text-base text-gray-600">Illinois</p>
          </button>

          <!-- New York -->
          <button
            @click="selectedCity = 'new york'"
            :class="[
              'rounded-3xl border-2 border-gray-200 bg-white/90 p-6 text-center transition-all hover:shadow-lg',
              selectedCity === 'new york'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
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
          <h3 class="font-nimbus text-4xl font-bold text-gray-800 mb-2">`{{ cityData.get(selectedCity).name }}` Weather</h3>
          <p class="font-nimbus text-lg text-gray-600">{{ cityData.get(selectedCity).location }}</p>
        </div>

        <!-- Current Weather -->
        <div class="bg-blue-50 rounded-3xl border border-blue-200 p-8 mb-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Main Weather Info -->
            <div class="text-center">
              <img src="../src/assets/sunny.png" alt="Sunny weather" class="w-29 h-28 object-contain mx-auto mb-4" />
              <div class="font-nimbus text-6xl font-bold text-gray-800 mb-4">72°F</div>
              <div class="font-nimbus text-3xl font-medium text-gray-700 mb-4">Sunny</div>
              <div class="font-nimbus text-lg text-gray-600">Clear skies</div>
            </div>

            <!-- Weather Details -->
            <div class="space-y-4">
              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">🌡️</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Feels Like</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">75°F</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-5">💧</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Humidity</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">65%</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">💨</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">Wind Speed</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">7 mph</span>
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
            <!-- Today -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Today</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">Dec 19</p>
              <img src="../src/assets/sunny_small.png" alt="Sunny" class="w-7 h-8 object-contain mx-auto mb-2" />
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">72°F</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">Sunny</div>
              <div class="font-nimbus text-xs text-gray-500">H: 75° L: 58°</div>
            </div>

            <!-- Tomorrow -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Tomorrow</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">Dec 20</p>
              <div class="text-4xl mb-2">⛅</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">68°F</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">Partly Cloudy</div>
              <div class="font-nimbus text-xs text-gray-500">H: 71° L: 55°</div>
            </div>

            <!-- Saturday -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Saturday</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">Dec 21</p>
              <div class="text-4xl mb-2">🌧️</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">63°F</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">Light Rain</div>
              <div class="font-nimbus text-xs text-gray-500">H: 66° L: 52°</div>
            </div>

            <!-- Sunday -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Sunday</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">Dec 22</p>
              <div class="text-4xl mb-2">☁️</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">65°F</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">Cloudy</div>
              <div class="font-nimbus text-xs text-gray-500">H: 68° L: 54°</div>
            </div>

            <!-- Monday -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">Monday</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">Dec 23</p>
              <div class="text-4xl mb-2">☀️</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">70°F</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">Sunny</div>
              <div class="font-nimbus text-xs text-gray-500">H: 73° L: 56°</div>
            </div>
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
