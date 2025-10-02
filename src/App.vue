<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { convertWeatherData } from './weatherDataConverter.js'

// Selected city state
const selectedCity = ref('San Francisco')
const cityWeatherDataSet = reactive(new Map());

// Audio state
const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentTrack = ref('default_guzheng.mp3')
const currentTrackName = ref('Spring River Flower Moon Night')
const hasUserInteracted = ref(false)

// Video state
const video = ref(null)
const isVideoPlaying = ref(false)
const currentVideo = ref('')
const showVideo = ref(false)
const showVideoControls = ref(true) // Start with controls visible for debugging
const controlsTimeout = ref(null)

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
      // console.log("Converted Weather Data:", weatherData);
      // Store the weather data for this city
      cityWeatherDataSet.set(cityName, weatherData[cityKey]);
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

// Audio functions
const togglePlayPause = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
  }
}

// Video control functions
const playVideo = () => {
  if (video.value && showVideo.value) {
    video.value.play().catch(error => {
      console.log('Video play failed:', error)
    })
  }
}

const pauseVideo = () => {
  if (video.value) {
    video.value.pause()
  }
}

// Synchronized play/pause for both video and audio
const toggleVideoAudioPlayPause = () => {
  if (isVideoPlaying.value) {
    // Currently playing, so pause both
    pauseVideo()
    if (audio.value) {
      audio.value.pause()
    }
  } else {
    // Currently paused, so play both
    playVideo()
    if (audio.value) {
      audio.value.play()
    }
  }
}

// Video controls visibility functions
const showControls = () => {
  showVideoControls.value = true
  // Clear existing timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  // Auto-hide controls after 3 seconds
  controlsTimeout.value = setTimeout(() => {
    showVideoControls.value = false
  }, 3000)
}

const hideControls = () => {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  showVideoControls.value = false
}

// Handle touch/click to show controls
const handleVideoInteraction = () => {
  if (showVideoControls.value) {
    // If controls are already showing, reset the timer
    showControls()
  } else {
    // If controls are hidden, show them
    showControls()
  }
}

const updateTime = () => {
  if (audio.value) {
    currentTime.value = audio.value.currentTime
    duration.value = audio.value.duration || 0
  }
}

const seekTo = (event) => {
  if (audio.value && duration.value) {
    const progressBar = event.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const progress = (clickX / rect.width) * 100
    audio.value.currentTime = (progress / 100) * duration.value
  }
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Computed values for audio
const progressPercentage = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const currentTimeFormatted = computed(() => formatTime(currentTime.value))
const durationFormatted = computed(() => formatTime(duration.value))

// Initialize audio when component mounts
onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener('loadedmetadata', () => {
      duration.value = audio.value.duration
      // Try to auto-play after metadata is loaded
      tryAutoPlay()
    })
    
    audio.value.addEventListener('timeupdate', updateTime)
    
    audio.value.addEventListener('play', () => {
      isPlaying.value = true
    })
    
    audio.value.addEventListener('pause', () => {
      isPlaying.value = false
    })
    
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
    })
    
    audio.value.addEventListener('canplaythrough', () => {
      // Try to auto-play when audio can play through without stopping
      tryAutoPlay()
    })
    
    // Load the audio file
    audio.value.load()
    
    // Add event listeners for user interaction to enable auto-play
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
  }
  
  // Initialize with default city video and audio after weather data loads
  setTimeout(() => {
    const defaultWeatherData = cityWeatherDataSet.get('San Francisco')
    if (defaultWeatherData && defaultWeatherData.weather) {
      const condition = defaultWeatherData.weather.condition
      playWeatherVideo('San Francisco', condition)
      playWeatherAudio(condition)
    } else {
      // Fallback to clear weather if no data available
      playWeatherVideo('San Francisco', 'clear')
      playWeatherAudio('clear')
    }
  }, 2000) // Wait 2 seconds for weather data to load
})

// Cleanup event listeners when component unmounts
onUnmounted(() => {
  document.removeEventListener('click', handleUserInteraction)
  document.removeEventListener('keydown', handleUserInteraction)
  document.removeEventListener('touchstart', handleUserInteraction)
})

// Function to attempt auto-play
const tryAutoPlay = () => {
  if (audio.value && !isPlaying.value) {
    audio.value.play().catch(error => {
      console.log('Auto-play failed:', error)
      // Auto-play failed due to browser policy, which is normal
      // The user will need to click the play button manually
    })
  }
}

// Handle user interaction to enable auto-play
const handleUserInteraction = () => {
  if (!hasUserInteracted.value && audio.value) {
    hasUserInteracted.value = true
    tryAutoPlay()
    // Remove the event listener after first interaction
    document.removeEventListener('click', handleUserInteraction)
    document.removeEventListener('keydown', handleUserInteraction)
    document.removeEventListener('touchstart', handleUserInteraction)
  }
}

// Map weather conditions to video filenames
const getVideoFilename = (weatherCondition) => {
  const conditionMap = {
    'clear': 'clear.mp4',
    'clouds': 'clouds.mp4',
    'cloudy': 'clouds.mp4',
    'rain': 'rain.mp4',
    'rainy': 'rain.mp4',
    'snow': 'snow.mp4',
    'snowy': 'snow.mp4',
    'wind': 'windy.mp4',
    'windy': 'windy.mp4'
  }
  
  const condition = weatherCondition?.toLowerCase() || 'clear'
  return conditionMap[condition] || 'clear.mp4'
}

// Map weather conditions to audio filenames
const getAudioFilename = (weatherCondition) => {
  const conditionMap = {
    'clear': 'sunny_guzheng.mp3',
    'sunny': 'sunny_guzheng.mp3',
    'clouds': 'cloudy_guzheng.mp3',
    'cloudy': 'cloudy_guzheng.mp3',
    'rain': 'rainy_guzheng.mp3',
    'rainy': 'rainy_guzheng.mp3',
    'snow': 'snowy_guzheng.mp3',
    'snowy': 'snowy_guzheng.mp3',
    'wind': 'windy_guzheng.mp3',
    'windy': 'windy_guzheng.mp3'
  }
  
  const condition = weatherCondition?.toLowerCase() || 'clear'
  return conditionMap[condition] || 'default_guzheng.mp3'
}

// Play weather video based on city and weather condition
const playWeatherVideo = (cityName, weatherCondition) => {
  const videoFilename = getVideoFilename(weatherCondition)
  // For now, let's not encode and see if spaces are the issue
  const videoPath = `media/${cityName}/${videoFilename}`
  
  // First, ensure the video element is visible and update the source
  showVideo.value = true
  currentVideo.value = videoPath
  
  // Wait for video to load then play
  setTimeout(() => {
    if (video.value && showVideo.value) {
      video.value.load()
      video.value.play().then(() => {
        isVideoPlaying.value = true
        console.log('Video playing:', videoPath)
      }).catch(() => {
        console.log('Video autoplay blocked, user can click to play')
      })
    }
  }, 100)
}

// Play weather audio based on weather condition
const playWeatherAudio = (weatherCondition) => {
  const audioFilename = getAudioFilename(weatherCondition)
  const newTrack = audioFilename
  
  // Update the current track
  currentTrack.value = newTrack
  
  // Update track name based on weather
  const trackNames = {
    'sunny_guzheng.mp3': 'Sunny Day Melody',
    'cloudy_guzheng.mp3': 'Cloudy Sky Harmony',
    'rainy_guzheng.mp3': 'Rainy Day Serenade',
    'snowy_guzheng.mp3': 'Snow Mountain Song',
    'windy_guzheng.mp3': 'Wind Through Bamboo',
    'default_guzheng.mp3': 'Spring River Flower Moon Night'
  }
  currentTrackName.value = trackNames[newTrack] || 'Traditional Guzheng Music'
  
  // Reload and play the new audio
  if (audio.value) {
    const wasPlaying = isPlaying.value
    audio.value.load() // Load new source
    
    if (wasPlaying) {
      // If music was playing, continue playing the new track
      setTimeout(() => {
        if (audio.value) {
          audio.value.play().catch(error => {
            console.log('Audio play failed:', error)
          })
        }
      }, 100)
    }
  }
}

// Handle video events
const onVideoEnded = () => {
  isVideoPlaying.value = false
  // Pause audio when video ends
  if (audio.value) {
    audio.value.pause()
  }
  // Show the key frame image when video ends
  setTimeout(() => {
    showVideo.value = false
  }, 500) // Small delay for smooth transition
}

const onVideoPlay = () => {
  isVideoPlaying.value = true
  // Play audio when video plays
  if (audio.value && !isPlaying.value) {
    audio.value.play().catch(error => {
      console.error('Audio sync play failed:', error)
    })
  }
}

const onVideoPause = () => {
  isVideoPlaying.value = false
  // Pause audio when video pauses
  if (audio.value && isPlaying.value) {
    audio.value.pause()
  }
}

// Handle city selection with video playback
const selectCityWithVideo = (cityName) => {
  selectedCity.value = cityName
  const weatherData = cityWeatherDataSet.get(cityName)
  
  if (weatherData && weatherData.weather) {
    const condition = weatherData.weather.condition
    // Play both weather video and audio
    playWeatherVideo(cityName, condition)
    playWeatherAudio(condition)
  } else {
    // Fallback to clear weather if no data available
    playWeatherVideo(cityName, 'clear')
    playWeatherAudio('clear')
  }
}
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
    <!-- src="../src/assets/guzheng_girl.png" -->
    <section class="relative min-h-[600px] bg-white">
      <div class="max-w-7xl mx-auto px-8 relative min-h-[600px] overflow-hidden">
        <!-- Background Image (Key Frame) -->
        <img 
          v-show="!isVideoPlaying"
          
          src="/guzheng_girl.png" 
          alt="Girl playing guzheng by the window with city skyline"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" 
        />
        
        <!-- Weather Video -->
        <video 
          v-show="showVideo"
          ref="video"
          class="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          preload="metadata"
          poster="/guzheng_girl.png"
          @ended="onVideoEnded"
          @play="onVideoPlay"
          @pause="onVideoPause">
          <source :src="currentVideo ? `/${currentVideo}` : ''" type="video/mp4">
          Your browser does not support the video element.
        </video>
        
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        
        <!-- Video Controls Overlay -->
        <div 
          class="absolute inset-0 z-20"
          @mouseenter="showControls"
          @mouseleave="hideControls"
          @click="handleVideoInteraction"
          @touchstart="handleVideoInteraction">
          <div 
            :class="[
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
              showVideoControls ? 'opacity-75' : 'opacity-0'
            ]">
            <button
              @click.stop="toggleVideoAudioPlayPause"
              class="w-32 h-32 rounded-full bg-black/75 hover:bg-black/90 flex items-center justify-center backdrop-blur-md border-4 border-white/60 hover:border-white/80 shadow-2xl hover:scale-105"
              style="transition: background-color 200ms, border-color 200ms, transform 200ms;">
              <!-- Play Icon (when video is paused) -->
              <svg v-if="!isVideoPlaying" class="w-12 h-12 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <!-- Pause Icon (when video is playing) -->
              <svg v-else class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
          </div>
          <!-- Debug info -->
          <!-- <div class="absolute top-4 left-4 text-white bg-black/50 p-2 rounded text-sm">
            showVideo: {{ showVideo }}<br>
            showVideoControls: {{ showVideoControls }}<br>
            isVideoPlaying: {{ isVideoPlaying }}<br>
            currentVideo: {{ currentVideo }}
          </div> -->
        </div>
        
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
            @click="selectCityWithVideo('San Francisco')"
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
            @click="selectCityWithVideo('Boston')"
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
            @click="selectCityWithVideo('Seattle')"
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
            @click="selectCityWithVideo('Chicago')"
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
            @click="selectCityWithVideo('New York')"
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
      <!-- Hidden audio element -->
      <audio ref="audio" preload="auto" autoplay loop>
        <source :src="`media/${currentTrack}`" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Song Info -->
        <div class="flex items-center flex-1 min-w-0">
          <div class="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0">
            <img src="../src/assets/music.png" alt="Album cover" class="w-full h-full object-cover" />
          </div>
          <div class="ml-4 min-w-0 flex-1">
            <h4 class="font-nimbus text-lg font-bold text-gray-800 truncate">
              {{ currentTrackName }}
            </h4>
            <p class="font-nimbus text-base text-gray-600 truncate">Traditional Guzheng Music</p>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center space-x-6 mx-6">
          <button
            @click="togglePlayPause"
            class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
            :class="isPlaying ? 'bg-pink-500' : 'bg-gray-100'">
            <!-- Play Icon (when not playing) -->
            <img v-if="!isPlaying" src="../src/assets/play.png" alt="Play" class="w-8 h-8 object-contain" />
            <!-- Pause Icon (when playing) - using two vertical bars -->
            <div v-else class="flex items-center space-x-1">
              <div class="w-1 h-4 bg-white rounded-sm"></div>
              <div class="w-1 h-4 bg-white rounded-sm"></div>
            </div>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="flex-1 max-w-80">
          <div class="bg-gray-200 rounded-full h-2 mb-1 cursor-pointer" @click="seekTo">
            <div class="bg-gray-400 h-2 rounded-full" :style="`width: ${progressPercentage}%`"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 font-nimbus">
            <span>{{ currentTimeFormatted }}</span>
            <span>{{ durationFormatted }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
