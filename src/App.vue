<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- City Selection Section -->
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center font-nimbus">Select a U.S. City</h1>

        <div class="flex flex-wrap justify-center gap-6">
          <!-- San Francisco - Selected -->
          <button
            @click="selectedCity = 'san-francisco'"
            :class="[
              'w-56 h-40 rounded-3xl border-2 p-6 flex flex-col items-center justify-between transition-all duration-200',
              selectedCity === 'san-francisco'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <div class="text-4xl">🌉</div>
            <div class="text-center">
              <div class="text-xl font-bold text-gray-800 font-nimbus">San Francisco</div>
              <div class="text-gray-600 font-nimbus">California</div>
            </div>
          </button>

          <!-- Boston -->
          <button
            @click="selectedCity = 'boston'"
            :class="[
              'w-56 h-40 rounded-3xl border-2 p-6 flex flex-col items-center justify-between transition-all duration-200 relative',
              selectedCity === 'boston'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img
              src="../media/boston.png"
              alt="Boston landmark"
              class="w-13 h-12 absolute top-4"
            />
            <div class="text-center mt-8">
              <div class="text-xl font-bold text-gray-800 font-nimbus">Boston</div>
              <div class="text-gray-600 font-nimbus">Massachusetts</div>
            </div>
          </button>

          <!-- Seattle -->
          <button
            @click="selectedCity = 'seattle'"
            :class="[
              'w-56 h-40 rounded-3xl border-2 p-6 flex flex-col items-center justify-between transition-all duration-200 relative',
              selectedCity === 'seattle'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img
              src="../media/seattle.png"
              alt="Seattle landmark"
              class="w-13 h-12 absolute top-4"
            />
            <div class="text-center mt-8">
              <div class="text-xl font-bold text-gray-800 font-nimbus">Seattle</div>
              <div class="text-gray-600 font-nimbus">Washington</div>
            </div>
          </button>

          <!-- Chicago -->
          <button
            @click="selectedCity = 'chicago'"
            :class="[
              'w-56 h-40 rounded-3xl border-2 p-6 flex flex-col items-center justify-between transition-all duration-200 relative',
              selectedCity === 'chicago'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <img
              src="../media/chicago.jpg"
              alt="Chicago landmark"
              class="w-13 h-12 absolute top-4"
            />
            <div class="text-center mt-8">
              <div class="text-xl font-bold text-gray-800 font-nimbus">Chicago</div>
              <div class="text-gray-600 font-nimbus">Illinois</div>
            </div>
          </button>

          <!-- New York -->
          <button
            @click="selectedCity = 'new-york'"
            :class="[
              'w-56 h-40 rounded-3xl border-2 p-6 flex flex-col items-center justify-between transition-all duration-200',
              selectedCity === 'new-york'
                ? 'border-pink-500 bg-gradient-pink shadow-pink'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md',
            ]"
          >
            <div class="text-4xl">🗽</div>
            <div class="text-center">
              <div class="text-xl font-bold text-gray-800 font-nimbus">New York</div>
              <div class="text-gray-600 font-nimbus">New York</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Weather Display Section -->
      <div
        class="bg-white rounded-3xl border border-gray-200 border-l-4 border-l-gray-200 p-10 space-y-8"
      >
        <!-- Header -->
        <div class="text-center space-y-2">
          <h2 class="text-4xl font-bold text-gray-800 font-nimbus">
            {{ cityData[selectedCity].name }} Weather
          </h2>
          <p class="text-lg text-gray-600 font-nimbus">
            {{ cityData[selectedCity].location }}
          </p>
        </div>

        <!-- Main Weather Card -->
        <div class="bg-gradient-blue border border-blue-200 rounded-3xl p-8">
          <div class="flex flex-col lg:flex-row items-start gap-12">
            <!-- Current Weather -->
            <div class="flex-1 text-center lg:text-left space-y-4 relative">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/63c84d980aa9cb269f007dd9045c76cb4a79d8f0?width=232"
                alt="Weather icon"
                class="w-29 h-31 absolute top-0 right-0 lg:right-auto lg:left-48"
              />
              <div class="space-y-2 pt-8 lg:pt-0">
                <div class="text-6xl font-bold text-gray-800 font-nimbus">
                  {{ cityData[selectedCity].weather.temperature }}
                </div>
                <div class="text-3xl text-gray-700 font-nimbus">
                  {{ cityData[selectedCity].weather.condition }}
                </div>
                <div class="text-lg text-gray-600 font-nimbus">
                  {{ cityData[selectedCity].weather.description }}
                </div>
              </div>
            </div>

            <!-- Weather Stats -->
            <div class="flex-1 space-y-6">
              <div class="bg-white bg-opacity-80 rounded-3xl border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">🌡️</span>
                    <span class="text-lg text-gray-700 font-nimbus">Feels Like</span>
                  </div>
                  <span class="text-xl font-bold text-gray-800 font-nimbus">
                    {{ cityData[selectedCity].weather.feelsLike }}
                  </span>
                </div>
              </div>

              <div class="bg-white bg-opacity-80 rounded-3xl border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">💧</span>
                    <span class="text-lg text-gray-700 font-nimbus">Humidity</span>
                  </div>
                  <span class="text-xl font-bold text-gray-800 font-nimbus">
                    {{ cityData[selectedCity].weather.humidity }}
                  </span>
                </div>
              </div>

              <div class="bg-white bg-opacity-80 rounded-3xl border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">💨</span>
                    <span class="text-lg text-gray-700 font-nimbus">Wind Speed</span>
                  </div>
                  <span class="text-xl font-bold text-gray-800 font-nimbus">
                    {{ cityData[selectedCity].weather.windSpeed }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Day Forecast -->
        <div class="space-y-6">
          <h3 class="text-3xl font-bold text-gray-800 text-center font-nimbus">5-Day Forecast</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="day in cityData[selectedCity].forecast"
              :key="day.day"
              class="bg-gradient-forecast border border-gray-200 rounded-3xl p-6 shadow-forecast space-y-2"
            >
              <div class="text-center space-y-1">
                <div class="text-lg font-bold text-gray-800 font-nimbus">{{ day.day }}</div>
                <div class="text-sm text-gray-600 font-nimbus">{{ day.date }}</div>
              </div>

              <div class="flex justify-center py-2">
                <div v-if="day.icon" class="text-4xl">{{ day.icon }}</div>
                <img
                  v-else-if="day.iconUrl"
                  :src="day.iconUrl"
                  :alt="day.condition"
                  class="w-8 h-7"
                />
              </div>

              <div class="text-center space-y-1">
                <div class="text-xl font-bold text-gray-800 font-nimbus">{{ day.temperature }}</div>
                <div class="text-sm text-gray-600 font-nimbus">{{ day.condition }}</div>
                <div class="text-xs text-gray-500 font-nimbus">{{ day.range }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center space-y-1">
          <p class="text-gray-500 font-nimbus">Last Updated: December 19, 2024 at 10:30 AM PST</p>
          <p class="text-sm text-gray-400 font-nimbus">Data refreshed every 15 minutes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Selected city state
const selectedCity = ref<string>('san-francisco')

// City data
const cityData = reactive({
  'san-francisco': {
    name: 'San Francisco',
    location: 'California, United States',
    weather: {
      temperature: '72°F',
      condition: 'Sunny',
      description: 'Clear skies',
      feelsLike: '75°F',
      humidity: '65%',
      windSpeed: '7 mph',
    },
    forecast: [
      {
        day: 'Today',
        date: 'Dec 19',
        iconUrl:
          'https://api.builder.io/api/v1/image/assets/TEMP/92fc4441800de44133ac7c5d54d9f0604a29a618?width=58',
        temperature: '72°F',
        condition: 'Sunny',
        range: 'H: 75�� L: 58°',
      },
      {
        day: 'Tomorrow',
        date: 'Dec 20',
        icon: '⛅',
        temperature: '68°F',
        condition: 'Partly Cloudy',
        range: 'H: 71° L: 55°',
      },
      {
        day: 'Saturday',
        date: 'Dec 21',
        icon: '🌧️',
        temperature: '63°F',
        condition: 'Light Rain',
        range: 'H: 66° L: 52°',
      },
      {
        day: 'Sunday',
        date: 'Dec 22',
        icon: '☁️',
        temperature: '65°F',
        condition: 'Cloudy',
        range: 'H: 68° L: 54°',
      },
      {
        day: 'Monday',
        date: 'Dec 23',
        icon: '☀️',
        temperature: '70°F',
        condition: 'Sunny',
        range: 'H: 73° L: 56°',
      },
    ],
  },
  boston: {
    name: 'Boston',
    location: 'Massachusetts, United States',
    weather: {
      temperature: '45°F',
      condition: 'Overcast',
      description: 'Cloudy skies',
      feelsLike: '42°F',
      humidity: '78%',
      windSpeed: '12 mph',
    },
    forecast: [
      {
        day: 'Today',
        date: 'Dec 19',
        icon: '☁️',
        temperature: '45°F',
        condition: 'Overcast',
        range: 'H: 48° L: 35°',
      },
      {
        day: 'Tomorrow',
        date: 'Dec 20',
        icon: '🌨️',
        temperature: '38°F',
        condition: 'Snow',
        range: 'H: 42° L: 28°',
      },
      {
        day: 'Saturday',
        date: 'Dec 21',
        icon: '❄️',
        temperature: '32°F',
        condition: 'Heavy Snow',
        range: 'H: 35° L: 22°',
      },
      {
        day: 'Sunday',
        date: 'Dec 22',
        icon: '⛅',
        temperature: '40°F',
        condition: 'Partly Cloudy',
        range: 'H: 43° L: 30°',
      },
      {
        day: 'Monday',
        date: 'Dec 23',
        icon: '☀️',
        temperature: '48°F',
        condition: 'Sunny',
        range: 'H: 52° L: 38°',
      },
    ],
  },
  seattle: {
    name: 'Seattle',
    location: 'Washington, United States',
    weather: {
      temperature: '52°F',
      condition: 'Rainy',
      description: 'Light drizzle',
      feelsLike: '48°F',
      humidity: '85%',
      windSpeed: '8 mph',
    },
    forecast: [
      {
        day: 'Today',
        date: 'Dec 19',
        icon: '🌧️',
        temperature: '52°F',
        condition: 'Rainy',
        range: 'H: 55° L: 45°',
      },
      {
        day: 'Tomorrow',
        date: 'Dec 20',
        icon: '⛅',
        temperature: '49°F',
        condition: 'Partly Cloudy',
        range: 'H: 53° L: 42°',
      },
      {
        day: 'Saturday',
        date: 'Dec 21',
        icon: '🌧️',
        temperature: '46°F',
        condition: 'Heavy Rain',
        range: 'H: 50° L: 40°',
      },
      {
        day: 'Sunday',
        date: 'Dec 22',
        icon: '☁️',
        temperature: '50°F',
        condition: 'Cloudy',
        range: 'H: 54° L: 43°',
      },
      {
        day: 'Monday',
        date: 'Dec 23',
        icon: '🌧️',
        temperature: '48°F',
        condition: 'Light Rain',
        range: 'H: 52° L: 41°',
      },
    ],
  },
  chicago: {
    name: 'Chicago',
    location: 'Illinois, United States',
    weather: {
      temperature: '28°F',
      condition: 'Snow',
      description: 'Heavy snowfall',
      feelsLike: '18°F',
      humidity: '92%',
      windSpeed: '15 mph',
    },
    forecast: [
      {
        day: 'Today',
        date: 'Dec 19',
        icon: '🌨️',
        temperature: '28°F',
        condition: 'Snow',
        range: 'H: 32° L: 20°',
      },
      {
        day: 'Tomorrow',
        date: 'Dec 20',
        icon: '❄️',
        temperature: '22°F',
        condition: 'Blizzard',
        range: 'H: 26° L: 15°',
      },
      {
        day: 'Saturday',
        date: 'Dec 21',
        icon: '☁️',
        temperature: '35°F',
        condition: 'Cloudy',
        range: 'H: 38° L: 28°',
      },
      {
        day: 'Sunday',
        date: 'Dec 22',
        icon: '⛅',
        temperature: '42°F',
        condition: 'Partly Cloudy',
        range: 'H: 45° L: 35°',
      },
      {
        day: 'Monday',
        date: 'Dec 23',
        icon: '☀️',
        temperature: '38°F',
        condition: 'Sunny',
        range: 'H: 42° L: 30°',
      },
    ],
  },
  'new-york': {
    name: 'New York',
    location: 'New York, United States',
    weather: {
      temperature: '39°F',
      condition: 'Partly Cloudy',
      description: 'Mix of sun and clouds',
      feelsLike: '34°F',
      humidity: '68%',
      windSpeed: '10 mph',
    },
    forecast: [
      {
        day: 'Today',
        date: 'Dec 19',
        icon: '⛅',
        temperature: '39°F',
        condition: 'Partly Cloudy',
        range: 'H: 43° L: 32°',
      },
      {
        day: 'Tomorrow',
        date: 'Dec 20',
        icon: '🌧️',
        temperature: '42°F',
        condition: 'Light Rain',
        range: 'H: 46° L: 36°',
      },
      {
        day: 'Saturday',
        date: 'Dec 21',
        icon: '☁️',
        temperature: '45°F',
        condition: 'Cloudy',
        range: 'H: 48° L: 38°',
      },
      {
        day: 'Sunday',
        date: 'Dec 22',
        icon: '⛅',
        temperature: '47°F',
        condition: 'Partly Cloudy',
        range: 'H: 51° L: 40°',
      },
      {
        day: 'Monday',
        date: 'Dec 23',
        icon: '☀️',
        temperature: '52°F',
        condition: 'Sunny',
        range: 'H: 55° L: 45°',
      },
    ],
  },
})
</script>
