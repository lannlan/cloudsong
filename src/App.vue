<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { convertWeatherData } from './weatherDataConverter.js'

// Language state (default: English)
const currentLanguage = ref('en')

// Translation objects
const translations = {
  en: {
    appTitle: 'Cloud Song',
    tagline: 'Where music bridges, love reaches',
    madeFor: 'Made for grandparents',
    withLove: 'With Love ❤️',
    selectCity: 'Select a City',
    weather: 'Weather',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    forecast: '5-Day Forecast',
    lastUpdated: 'Data Last Updated',
    dataSource: 'Weather data from OpenWeatherMap API',
    footerText: 'Cloud Song © 2025 · Made with love for grandparents',
    musicCategory: 'Traditional Guzheng Music',
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hourAgo: '1 hour ago',
    hoursAgo: 'hours ago',
    today: 'Today',
    loading: 'Loading...',
    location: 'Location',
    // Cities
    sanFrancisco: 'San Francisco',
    boston: 'Boston',
    chicago: 'Chicago',
    beijing: 'Beijing',
    tianjin: 'Tianjin',
    // States/Regions
    california: 'California',
    massachusetts: 'Massachusetts',
    illinois: 'Illinois',
    // Weather conditions
    clear: 'Clear',
    clouds: 'Cloudy',
    rain: 'Rainy',
    snow: 'Snowy',
    wind: 'Windy'
  },
  zh: {
    appTitle: '云歌',
    tagline: '音乐为桥，情达千里',
    madeFor: '献给我的祖父母',
    withLove: '满怀爱意 ❤️',
    selectCity: '选择城市',
    weather: '天气',
    feelsLike: '体感温度',
    humidity: '湿度',
    windSpeed: '风速',
    forecast: '未来5天预报',
    lastUpdated: '数据更新时间',
    dataSource: '天气数据来自OpenWeatherMap API',
    footerText: '云歌 © 2025 · 用爱为祖父母制作',
    musicCategory: '传统古筝音乐',
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hourAgo: '1小时前',
    hoursAgo: '小时前',
    today: '今天',
    loading: '加载中...',
    location: '位置',
    // Cities
    sanFrancisco: '旧金山',
    boston: '波士顿',
    chicago: '芝加哥',
    beijing: '北京',
    tianjin: '天津',
    // States/Regions
    california: '加利福尼亚',
    massachusetts: '马萨诸塞',
    illinois: '伊利诺伊',
    // Weather conditions
    clear: '晴朗',
    clouds: '多云',
    rain: '下雨',
    snow: '下雪',
    wind: '大风'
  }
}

// Computed property for current translations
const t = computed(() => translations[currentLanguage.value])

// Unit conversion functions
const celsiusToFahrenheit = (celsius) => {
  return Math.round(celsius * 9/5 + 32)
}

const msToMph = (ms) => {
  return Math.round(ms * 2.237)
}

const convertTemperature = (tempString) => {
  if (!tempString) return tempString
  // Extract number from string like "15°C"
  const match = tempString.match(/-?\d+/)
  if (!match) return tempString
  const celsius = parseInt(match[0])
  if (currentLanguage.value === 'en') {
    return `${celsiusToFahrenheit(celsius)}°F`
  }
  return tempString
}

const convertWindSpeed = (speedString) => {
  if (!speedString) return speedString
  // Extract number from string like "5.2 m/s"
  const match = speedString.match(/[\d.]+/)
  if (!match) return speedString
  const ms = parseFloat(match[0])
  if (currentLanguage.value === 'en') {
    return `${msToMph(ms)} mph`
  }
  return speedString
}

const convertTemperatureRange = (rangeString) => {
  if (!rangeString) return rangeString
  // Extract numbers from string like "H: 18°C L: 12°C"
  const matches = rangeString.match(/-?\d+/g)
  if (!matches || matches.length < 2) return rangeString
  const high = parseInt(matches[0])
  const low = parseInt(matches[1])
  if (currentLanguage.value === 'en') {
    return `H: ${celsiusToFahrenheit(high)}°F L: ${celsiusToFahrenheit(low)}°F`
  } else {
    // Chinese mode: translate H/L labels
    return `最高: ${high}°C 最低: ${low}°C`
  }
}

// Translation functions for API data
const translateCityName = (cityName) => {
  if (!cityName || currentLanguage.value === 'en') return cityName
  
  const cityMap = {
    'San Francisco': '旧金山',
    'Boston': '波士顿',
    'Chicago': '芝加哥',
    'Beijing': '北京',
    'Tianjin': '天津'
  }
  return cityMap[cityName] || cityName
}

const translateWeatherCondition = (condition) => {
  if (!condition || currentLanguage.value === 'en') return condition
  
  const conditionMap = {
    'Clear': '晴朗',
    'Sunny': '晴朗',
    'Clouds': '多云',
    'Cloudy': '多云',
    'Partly Cloudy': '局部多云',
    'Overcast': '阴天',
    'Rain': '下雨',
    'Rainy': '下雨',
    'Drizzle': '小雨',
    'Light rain': '小雨',
    'Moderate rain': '中雨',
    'Heavy rain': '大雨',
    'Snow': '下雪',
    'Snowy': '下雪',
    'Light snow': '小雪',
    'Heavy snow': '大雪',
    'Thunderstorm': '雷暴',
    'Mist': '薄雾',
    'Fog': '雾',
    'Haze': '霾',
    'Wind': '大风',
    'Windy': '大风'
  }
  return conditionMap[condition] || condition
}

const translateDayName = (dayName) => {
  if (!dayName || currentLanguage.value === 'en') return dayName
  
  const dayMap = {
    'Today': '今天',
    'Tomorrow': '明天',
    'Monday': '星期一',
    'Tuesday': '星期二',
    'Wednesday': '星期三',
    'Thursday': '星期四',
    'Friday': '星期五',
    'Saturday': '星期六',
    'Sunday': '星期日'
  }
  return dayMap[dayName] || dayName
}

const translateDescription = (description) => {
  if (!description || currentLanguage.value === 'en') return description
  
  const descriptionMap = {
    'clear sky': '晴空',
    'few clouds': '少云',
    'scattered clouds': '疏云',
    'broken clouds': '碎云',
    'overcast clouds': '阴云密布',
    'shower rain': '阵雨',
    'rain': '雨',
    'light rain': '小雨',
    'moderate rain': '中雨',
    'heavy intensity rain': '大雨',
    'thunderstorm': '雷暴',
    'snow': '雪',
    'light snow': '小雪',
    'heavy snow': '大雪',
    'mist': '薄雾',
    'fog': '雾',
    'haze': '霾'
  }
  
  // Try exact match first
  const lowerDesc = description.toLowerCase()
  if (descriptionMap[lowerDesc]) {
    return descriptionMap[lowerDesc]
  }
  
  // Try partial matches
  for (const [key, value] of Object.entries(descriptionMap)) {
    if (lowerDesc.includes(key)) {
      return value
    }
  }
  
  return description
}

const translateDate = (dateString) => {
  if (!dateString || currentLanguage.value === 'en') return dateString
  
  const monthMap = {
    'Jan': '1月',
    'Feb': '2月',
    'Mar': '3月',
    'Apr': '4月',
    'May': '5月',
    'Jun': '6月',
    'Jul': '7月',
    'Aug': '8月',
    'Sep': '9月',
    'Oct': '10月',
    'Nov': '11月',
    'Dec': '12月'
  }
  
  // Match pattern like "Oct 12" or "Jan 5"
  const match = dateString.match(/([A-Za-z]+)\s+(\d+)/)
  if (match) {
    const [, month, day] = match
    const chineseMonth = monthMap[month] || month
    return `${chineseMonth}${day}日`
  }
  
  return dateString
}

const translateLocation = (location) => {
  if (!location || currentLanguage.value === 'en') return location
  
  const locationMap = {
    'California, United States': '加利福尼亚州，美国',
    'Massachusetts, United States': '马萨诸塞州，美国',
    'Illinois, United States': '伊利诺伊州，美国',
    'Washington, United States': '华盛顿州，美国',
    'New York, United States': '纽约州，美国',
    'Beijing, China': '北京，中国',
    'Tianjin, China': '天津，中国',
    'United States': '美国',
    'China': '中国'
  }
  
  return locationMap[location] || location
}

// Selected city state
const selectedCity = ref('San Francisco')
const cityWeatherDataSet = reactive(new Map());
const lastUpdated = ref(null)
const now = ref(new Date())

// Audio state
const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentTrack = ref('sunny_guzheng.mp3')
const currentTrackName = ref('Spring River Flower Moon Night')

// Video state
const video = ref(null)
const isVideoPlaying = ref(false)
const currentVideo = ref('')
const showVideo = ref(false)
const showVideoControls = ref(true) // Start visible for 5 seconds
const controlsTimeout = ref(null)
const showVideoContent = ref(false) // Simple state for transition

const updateCityWeatherConditions = (cityName) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  return fetch(
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
      // Update the last updated timestamp
      lastUpdated.value = new Date();
      
      // If this is the default city (San Francisco), set up media but don't auto-play
      if (cityName === 'San Francisco' && weatherData[cityKey] && weatherData[cityKey].weather) {
        const condition = weatherData[cityKey].weather.condition;
        setupWeatherVideo('San Francisco', condition, true); // true = isInitialLoad
        setupWeatherAudio(condition);
        // Don't auto-play on initial load - only when user clicks city
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching weather data.");
    });
};


// Pre-fetch weather data for all cities
updateCityWeatherConditions('San Francisco');
updateCityWeatherConditions('Boston');
// updateCityWeatherConditions('Seattle');
updateCityWeatherConditions('Chicago');
// updateCityWeatherConditions('New York');
updateCityWeatherConditions('beijing');
updateCityWeatherConditions('tianjin');


const curCityWeatherData = computed(() => cityWeatherDataSet.get(selectedCity.value) || null)

// Format last updated time
const formattedLastUpdated = computed(() => {
  if (!lastUpdated.value) return currentLanguage.value === 'en' ? 'Never' : '从未'
  
  // Use now.value to make this computed property reactive to time changes
  const currentMoment = now.value
  const diff = currentMoment - lastUpdated.value
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 5) return t.value.justNow
  
  // Round to nearest 5 minutes for display
  const roundedMinutes = Math.floor(minutes / 5) * 5
  if (roundedMinutes < 60) return `${roundedMinutes} ${t.value.minutesAgo}`
  
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return t.value.hourAgo
  if (hours < 24) return `${hours} ${t.value.hoursAgo}`
  
  // For older updates, show full date and time
  const locale = currentLanguage.value === 'en' ? 'en-US' : 'zh-CN'
  return lastUpdated.value.toLocaleString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })
})

// Audio functions
const togglePlayPause = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause()
      // Also pause video when audio is paused
      pauseVideo()
    } else {
      audio.value.play()
      // Also play video when audio is played
      playVideo()
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
  // Auto-hide controls after 3 seconds when user stops interacting
  controlsTimeout.value = setTimeout(() => {
    showVideoControls.value = false
  }, 3000)
}

const hideControls = () => {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  // Small delay before hiding to prevent flickering
  controlsTimeout.value = setTimeout(() => {
    showVideoControls.value = false
  }, 500)
}

// Handle touch/click interaction
const handleVideoInteraction = () => {
  // Show controls and reset timer
  showControls()
  
  // Also remove poster if it's still there (safety net)
  if (video.value && video.value.hasAttribute('poster')) {
    video.value.removeAttribute('poster')
    console.log('Poster removed via user interaction')
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
  // Hide video controls after 5 seconds on page load
  setTimeout(() => {
    showVideoControls.value = false
  }, 5000)
  
  // Update current time every 5 minutes to keep "last updated" fresh
  const timeInterval = setInterval(() => {
    now.value = new Date()
  }, 300000) // Update every 5 minutes
  
  // Store interval ID for cleanup
  window._timeUpdateInterval = timeInterval
  
  if (audio.value) {
    audio.value.addEventListener('loadedmetadata', () => {
      duration.value = audio.value.duration
      // Don't auto-play - let user control playback
    })
    
    audio.value.addEventListener('timeupdate', updateTime)
    
    audio.value.addEventListener('play', () => {
      isPlaying.value = true
      // Sync video when audio plays
      if (video.value && showVideo.value && !isVideoPlaying.value) {
        video.value.play().catch(error => {
          console.log('Video sync play failed:', error)
        })
      }
    })
    
    audio.value.addEventListener('pause', () => {
      isPlaying.value = false
      // Sync video when audio pauses
      if (video.value && isVideoPlaying.value) {
        video.value.pause()
      }
    })
    
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
      // Pause video when audio ends
      if (video.value && isVideoPlaying.value) {
        video.value.pause()
      }
    })
    
    // Load the audio file but don't auto-play
    audio.value.load()
  }
  
  // Fallback setup in case weather data doesn't load within 3 seconds
  setTimeout(() => {
    const defaultWeatherData = cityWeatherDataSet.get('San Francisco')
    if (!defaultWeatherData || !defaultWeatherData.weather) {
      // Setup fallback with clear weather but don't auto-play
      setupWeatherVideo('San Francisco', 'clear', true); // true = isInitialLoad
      setupWeatherAudio('clear');
      // Don't auto-play on initial load - only when user clicks city
    }
  }, 3000) // Wait 3 seconds for weather data, then fallback
})

// Cleanup event listeners when component unmounts
onUnmounted(() => {
  // Clear the time update interval
  if (window._timeUpdateInterval) {
    clearInterval(window._timeUpdateInterval)
  }
  // Clear controls timeout
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})

// Map weather conditions to video filenames
const getVideoFilename = (weatherCondition) => {
  const conditionMap = {
    'clear': 'clear.mp4',
    'clouds': 'clouds.mp4',
    'cloudy': 'clouds.mp4',
    'partlycloudy': 'clouds.mp4',
    'overcast': 'clouds.mp4',
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
    'partlycloudy': 'cloudy_guzheng.mp3',
    'partly cloudy': 'cloudy_guzheng.mp3', // Keep both variants for compatibility
    'overcast': 'cloudy_guzheng.mp3',
    'rain': 'rainy_guzheng.mp3',
    'rainy': 'rainy_guzheng.mp3',
    'snow': 'snowy_guzheng.mp3',
    'snowy': 'snowy_guzheng.mp3',
    'wind': 'windy_guzheng.mp3',
    'windy': 'windy_guzheng.mp3'
  }
  
  const condition = weatherCondition?.toLowerCase() || 'clear'
  return conditionMap[condition] || 'sunny_guzheng.mp3'
}

// Setup weather video based on city and weather condition (don't auto-play)
const setupWeatherVideo = (cityName, weatherCondition, isInitialLoad = false) => {
  console.log(`setupWeatherVideo, ${cityName}, ${weatherCondition}, ${isInitialLoad}`)
  const videoFilename = getVideoFilename(weatherCondition)
  const videoPath = `media/${cityName}/${videoFilename}`
  
  // Reset transition state for new video
  showVideoContent.value = !isInitialLoad || cityName !== 'San Francisco'
  
  // Setup the video element but don't auto-play
  showVideo.value = true
  currentVideo.value = videoPath
  
  // Only set poster for initial San Francisco load
  if (video.value) {
    if (isInitialLoad && cityName === 'San Francisco') {
      video.value.setAttribute('poster', '/guzheng_girl.png')
    } else {
      video.value.removeAttribute('poster')
    }
  }
  
  // Load video but don't play
  setTimeout(() => {
    if (video.value && showVideo.value) {
      video.value.load()
      console.log('Video ready:', videoPath)
      
      // Add multiple event listeners to ensure poster removal (only if poster was set)
      if (isInitialLoad && cityName === 'San Francisco') {
        const removePoster = () => {
          if (video.value && video.value.hasAttribute('poster')) {
            // Force video to show first frame immediately
            video.value.currentTime = 0.1
            // Trigger fade-in transition
            showVideoContent.value = true
            // Remove poster after fade-in completes
            setTimeout(() => {
              video.value.removeAttribute('poster')
              console.log('Poster removed for', cityName)
            }, 300) // Wait for fade-in to complete
            // Clean up all listeners
            video.value.removeEventListener('loadeddata', removePoster)
            video.value.removeEventListener('canplay', removePoster)
            video.value.removeEventListener('loadedmetadata', removePoster)
          }
        }
        
        // Try multiple events to ensure poster removal
        video.value.addEventListener('loadeddata', removePoster)
        video.value.addEventListener('canplay', removePoster)
        video.value.addEventListener('loadedmetadata', removePoster)
        
        // Fallback: force remove poster after 3 seconds if events don't fire
        setTimeout(() => {
          if (video.value && video.value.hasAttribute('poster')) {
            console.log('Fallback: removing poster after timeout for', cityName)
            removePoster()
          }
        }, 3000)
      }
    }
  }, 100)
}

// Setup weather audio based on weather condition (don't auto-play)
const setupWeatherAudio = (weatherCondition) => {
  const audioFilename = getAudioFilename(weatherCondition)
  const newTrack = audioFilename
  
  // Update the current track
  currentTrack.value = newTrack
  
  // Update track name based on weather
  const trackNames = {
    'sunny_guzheng.mp3': "Kikujiro (菊次郎的夏天)",
    'cloudy_guzheng.mp3': "Fisherman's Song at Dusk (渔舟唱晚)",
    'rainy_guzheng.mp3': "Rain on the Mountain (半山听雨)",
    'snowy_guzheng.mp3': "Jingle Bells (铃儿叮当)",
    'windy_guzheng.mp3': "Fighting the Typhoon (战台风)"
  }
  currentTrackName.value = trackNames[newTrack] || 'Traditional Guzheng Music'
  
  // Load the new audio but don't auto-play
  if (audio.value) {
    audio.value.load()
    console.log('Audio ready:', newTrack)
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

const onVideoLoaded = () => {
  // Once video is loaded, remove the poster to show video content
  if (video.value) {
    if (video.value.hasAttribute('poster')) {
      // Force video to show first frame immediately
      video.value.currentTime = 0.1
      // Trigger fade-in transition
      showVideoContent.value = true
      // Remove poster after fade-in completes
      setTimeout(() => {
        video.value.removeAttribute('poster')
        console.log('Poster removed, showing video content')
      }, 300) // Wait for fade-in to complete
    }
  }
}

// Handle city selection with video playback
const selectCityWithVideo = (cityName) => {
  selectedCity.value = cityName
  const weatherData = cityWeatherDataSet.get(cityName)
  
  if (weatherData && weatherData.weather) {
    const condition = weatherData.weather.condition
    // Setup both weather video and audio
    setupWeatherVideo(cityName, condition)
    setupWeatherAudio(condition)
  } else {
    // Fallback to clear weather if no data available
    setupWeatherVideo(cityName, 'clear')
    setupWeatherAudio('clear')
  }
  
  // Auto-play both video and audio after a short delay to ensure media is loaded
  setTimeout(() => {
    if (video.value && audio.value) {
      video.value.play().catch(e => console.log('Video autoplay failed:', e))
      audio.value.play().catch(e => console.log('Audio autoplay failed:', e))
      isVideoPlaying.value = true
      isPlaying.value = true
      showControls() // Show controls briefly when auto-playing
    }
  }, 200)
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white/90 shadow-sm border-b border-gray-200 px-3 sm:px-28 py-6 relative z-10">
      <!-- Language Toggle Switch - Top Right Corner -->
      <div class="absolute top-4 right-4 sm:right-28 z-20">
        <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1 border-2 border-gray-200">
          <button
            @click="currentLanguage = 'en'"
            :class="[
              'px-4 py-1.5 rounded-full font-nimbus text-sm font-medium transition-all duration-200',
              currentLanguage === 'en'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            ]"
          >
            English
          </button>
          <button
            @click="currentLanguage = 'zh'"
            :class="[
              'px-4 py-1.5 rounded-full font-nimbus text-sm font-medium transition-all duration-200',
              currentLanguage === 'zh'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            ]"
          >
            中文
          </button>
        </div>
      </div>
      
      <div class="flex items-center justify-between gap-4 sm:gap-25 flex-wrap">
        <div class="flex items-center min-w-60">
          <img src="../src/assets/cloud_song_logo.png" alt="Cloud Song logo"
            class="w-15 h-15 rounded-full object-cover" />

          <div class="ml-3 max-w-96">
            <h1 class="font-limelight text-3xl text-gray-800 leading-tight">{{ t.appTitle }}</h1>
            <p class="font-inter text-base text-gray-600">{{ t.tagline }}</p>
          </div>

        </div>

        <div class="text-right flex flex-col items-end">
          <p class="font-nimbus text-base text-gray-800 font-medium">{{ t.madeFor }}</p>
          <p class="text-pink-500 text-sm font-inter font-medium">{{ t.withLove }}</p>
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
          :class="[
            'absolute inset-0 w-full h-full object-cover video-no-poster transition-opacity duration-500 ease-in-out',
            showVideoContent ? 'opacity-100' : 'opacity-0'
          ]"
          muted
          loop
          preload="metadata"
          poster="/guzheng_girl.png"
          @ended="onVideoEnded"
          @play="onVideoPlay"
          @pause="onVideoPause"
          @loadeddata="onVideoLoaded">
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
            <!-- <h2 class="font-nimbus text-5xl font-bold text-white leading-none mb-6">Cloud Song</h2>
            <p class="font-nimbus text-xl text-white max-w-sm mx-auto leading-relaxed">
              Where music bridges, love reaches
            </p> -->
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto px-8 py-12 w-full" style="background: linear-gradient(to bottom right, #F3F7FA, #A5B2C5);">
      <!-- City Selection -->
      <section class="mb-8">
        <h3 class="font-nimbus text-3xl font-bold text-gray-800 text-center mb-6">
          {{ t.selectCity }}
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
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ t.sanFrancisco }}</h4>
            <p class="font-nimbus text-base text-gray-600">{{ t.california }}</p>
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
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ t.boston }}</h4>
            <p class="font-nimbus text-base text-gray-600">{{ t.massachusetts }}</p>
          </button>

          <!-- Seattle -->
          <!-- <button
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
          </button> -->

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
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ t.chicago }}</h4>
            <p class="font-nimbus text-base text-gray-600">{{ t.illinois }}</p>
          </button>

          <!-- New York -->
          <!-- <button
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
          </button> -->

          <button
            @click="selectCityWithVideo('beijing')"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'beijing'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <img src="../src/assets/forbidden-city.png" alt="Beijing" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ t.beijing }}</h4>
            <p class="font-nimbus text-base text-gray-600">{{ t.beijing }}</p>
          </button>

          <button
            @click="selectCityWithVideo('tianjin')"
            :class="[
              'rounded-3xl border-2 bg-white p-6 text-center transition-all',
              selectedCity === 'tianjin'
                ? 'border-pink-500 bg-gradient-pink shadow-pink shadow-lg'
                : 'border-gray-200 bg-white bg-opacity-90 hover:bg-opacity-100 hover:shadow-md hover:shadow-xl',
            ]"
          >
            <img src="../src/assets/wheel.jpg" alt="Tianjin" class="w-13 h-12 object-contain mx-auto mb-3" />
            <h4 class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ t.tianjin }}</h4>
            <p class="font-nimbus text-base text-gray-600">{{ t.tianjin }}</p>
          </button>
        </div>
      </section>

      <!-- Weather Display -->
      <section class="bg-white rounded-3xl border-4 border-l-4 border-gray-200 p-11">
        <div class="text-center mb-8">
          <h3 class="font-nimbus text-4xl font-bold text-gray-800 mb-2">{{ translateCityName(curCityWeatherData?.name || selectedCity) }} {{ t.weather }}</h3>
          <p class="font-nimbus text-lg text-gray-600">{{ translateLocation(curCityWeatherData?.location) || t.location }}</p>
        </div>

        <!-- Current Weather -->
        <div class="bg-blue-50 rounded-3xl border border-blue-200 p-8 mb-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Main Weather Info -->
            <div class="text-center">
              <div class="text-9xl mb-4">{{ curCityWeatherData?.forecast?.[0]?.icon || '☀️' }}</div>
              <div class="font-nimbus text-6xl font-bold text-gray-800 mb-4">{{ convertTemperature(curCityWeatherData?.weather?.temperature) }}</div>
              <div class="font-nimbus text-3xl font-medium text-gray-700 mb-4">{{ translateWeatherCondition(curCityWeatherData?.weather?.condition) }}</div>
              <div class="font-nimbus text-lg text-gray-600">{{ translateDescription(curCityWeatherData?.weather?.description) }}</div>
            </div>

            <!-- Weather Details -->
            <div class="space-y-4">
              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">🌡️</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">{{ t.feelsLike }}</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ convertTemperature(curCityWeatherData?.weather?.feelsLike) }}</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-5">💧</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">{{ t.humidity }}</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ curCityWeatherData?.weather?.humidity }}</span>
              </div>

              <div class="bg-white/80 rounded-3xl border border-gray-200 p-6 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">💨</span>
                  <span class="font-nimbus text-lg font-medium text-gray-700">{{ t.windSpeed }}</span>
                </div>
                <span class="font-nimbus text-xl font-bold text-gray-800">{{ convertWindSpeed(curCityWeatherData?.weather?.windSpeed) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Day Forecast -->
        <div class="mb-8">
          <h4 class="font-nimbus text-3xl font-bold text-gray-800 text-center mb-6">
            {{ t.forecast }}
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div 
              v-for="(forecast, index) in (curCityWeatherData?.forecast || []).slice(0, 5)" 
              :key="index"
              class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center"
            >
              <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">{{ translateDayName(forecast.day) }}</h5>
              <p class="font-nimbus text-sm text-gray-600 mb-2">{{ translateDate(forecast.date) }}</p>
              <div class="text-4xl mb-2">{{ forecast.icon }}</div>
              <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">{{ convertTemperature(forecast.temperature) }}</div>
              <div class="font-nimbus text-sm text-gray-600 mb-1">{{ translateWeatherCondition(forecast.condition) }}</div>
              <div class="font-nimbus text-xs text-gray-500">{{ convertTemperatureRange(forecast.range) }}</div>
            </div>
            
            <!-- Fallback static forecast cards if no data -->
            <template v-if="!curCityWeatherData?.forecast || curCityWeatherData.forecast.length === 0">
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 text-center">
                <h5 class="font-nimbus text-lg font-bold text-gray-800 mb-2">{{ t.today }}</h5>
                <p class="font-nimbus text-sm text-gray-600 mb-2">{{ t.loading }}</p>
                <div class="text-4xl mb-2">☀️</div>
                <div class="font-nimbus text-xl font-bold text-gray-800 mb-1">--°F</div>
                <div class="font-nimbus text-sm text-gray-600 mb-1">{{ t.loading }}</div>
                <div class="font-nimbus text-xs text-gray-500">H: --° L: --°</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="text-center text-gray-500">
          <p class="font-nimbus text-base mb-1">{{ t.lastUpdated }}: {{ formattedLastUpdated }}</p>
          <p class="font-nimbus text-sm text-gray-400">{{ t.dataSource }}</p>
        </div>
      </section>
    </main>

    <!-- Music Player -->
    <div class="bg-white/95 px-8 py-6 backdrop-blur-sm">
      <!-- Hidden audio element -->
      <audio ref="audio" preload="auto" loop>
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
            <p class="font-nimbus text-base text-gray-600 truncate">{{ t.musicCategory }}</p>
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

    <!-- Footer -->
    <footer class="bg-white/95 border-t border-gray-200 px-8 py-6 backdrop-blur-sm" style="box-shadow: 0 25px 50px 5px rgba(0, 0, 0, 0.25), 0 35px 70px 15px rgba(0, 0, 0, 0.35);">
      <div class="text-center">
        <div class="flex items-center justify-center mb-4">
          <span class="text-xl mr-2">🎵</span>
          <span class="font-nimbus text-lg font-medium text-gray-700">{{ t.tagline }}</span>
          <span class="text-xl ml-2">❤️</span>
        </div>
        <p class="font-nimbus text-base text-gray-500">
          {{ t.footerText }}
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Force video to show content instead of poster when loaded */
.video-no-poster:not([poster]) {
  background: transparent;
}

/* Additional styles to ensure video content is visible */
video {
  object-fit: cover;
}
</style>
