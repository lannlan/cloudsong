const apiKey = "82a0b934e7d4c67612548761372c8a32";
//const city = "Sunnyvale";

const forecastDiv = document.getElementById("forecast");
const art = document.getElementById("art");
const music = document.getElementById("music");
const weatherInfo = document.getElementById("weatherInfo");
const weatherDetails = document.getElementById("weatherDetails");

const loadWeatherBtnCA = document.getElementById("loadWeatherCA");
const loadWeatherBtnBJ = document.getElementById("loadWeatherBJ");
const loadWeatherBtnTJ = document.getElementById("loadWeatherTJ");

// Removed inline styles - now using CSS styles instead

// Weather-to-media mapping
const weatherMap = {
  clear: { art: "media/sunny_art.png", music: "media/sunny_guzheng.mp3" },
  clouds: { art: "media/cloudy_art.png", music: "media/cloudy_guzheng.mp3" },
  rain: { art: "media/rainy_art.png", music: "media/rainy_guzheng.mp3" },
  snow: { art: "media/snowy_art.png", music: "media/snowy_guzheng.mp3" },
  // thunderstorm: {
  //   art: "media/storm_art.png",
  //   music: "media/storm_guzheng.mp3",
  // },
  default: { art: "media/default_art.png", music: "media/default_guzheng.mp3" },
};

// Function to display weather details in the info div
const displayWeatherInfo = (forecast, date) => {
  const temp = forecast.main.temp;
  const humidity = forecast.main.humidity;
  const windSpeed = forecast.wind.speed;
  const visible = forecast.visibility;
  const feelsLike = forecast.main.feels_like;
  console.log(`Feels Like: ${feelsLike}°C`);

  weatherDetails.innerHTML = `
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Feels Like:</strong> ${feelsLike}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    <p><strong>Visibility:</strong> ${visible} meters</p>
  `;
  weatherInfo.style.display = "flex";
};

const showWeatherConditions = (city) => {
  forecastDiv.style.display = "block"; // <-- Make sure it's visible again!
  forecastDiv.innerHTML = `<h2>Select a Day in ${city}:</h2>`;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      // Get daily forecast (every 24 hours = every 8th item)
      const dailyForecasts = data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5);
      console.log("Daily Forecasts (debug):");
      if (dailyForecasts.length === 0) {
        alert("No forecast data available for the next 5 days.");
        return;
      }
      dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt_txt).toDateString();
        const weather = forecast.weather[0].main.toLowerCase();
        const weatherDesc = forecast.weather[0].description;
        console.log(`${date}: ${weather} (${weatherDesc})`);

        btn_html = `<p>${date} – ${weather}</p>`;
        // forecastDiv.innerHTML += html;
        const btn = document.createElement("button");
        btn.innerHTML = btn_html;
        // btn.textContent = `${date} – ${weather}`;
        btn.style.margin = "10px";
        btn.style.margin = "10px";
        btn.style.padding = "10px 20px";
        btn.style.borderRadius = "12px";
        btn.style.border = "none";
        btn.style.backgroundColor = "#d4e9e2";
        btn.style.color = "#333";
        btn.style.fontSize = "16px";
        btn.style.cursor = "pointer";
        btn.style.transition = "all 0.2s ease-in-out";

        btn.addEventListener("mouseover", () => {
          btn.style.backgroundColor = "#b0dacf";
        });

        btn.addEventListener("mouseout", () => {
          btn.style.backgroundColor = "#d4e9e2";
        });

        btn.addEventListener("click", () => {
          const match = weatherMap[weather] || weatherMap.default;
          art.src = match.art;
          music.src = match.music;
          art.style.display = "block";
          music.style.display = "block";

          // Display weather information in the info div
          displayWeatherInfo(forecast, date);

          // Sync audio in p5.js
          if (song && song.isPlaying()) {
            song.stop();
          }
          song = loadSound(match.music, () => {
            song.play();
          });
          updateWeatherVisuals(
            forecast.main.temp,
            forecast.main.humidity,
            forecast.wind.speed
          );
        });

        forecastDiv.appendChild(btn);
      });
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching weather data.");
    });
};

loadWeatherBtnCA.addEventListener("click", () => {
  showWeatherConditions("Sunnyvale");
});

loadWeatherBtnBJ.addEventListener("click", () => {
  showWeatherConditions("Beijing");
});

loadWeatherBtnTJ.addEventListener("click", () => {
  showWeatherConditions("Tianjin");
});

const aboutBtn = document.getElementById("aboutBtn");
const mainView = document.getElementById("mainView");
const aboutScreen = document.getElementById("aboutScreen");

function showMainViewCA() {
  mainView.style.display = "block";
  aboutScreen.style.display = "none";
  forecastDiv.style.display = "block"; // so 5-day buttons remain visible
  loadWeatherBtnCA.classList.add("active-tab");
  aboutBtn.classList.remove("active-tab");
  loadWeatherBtnBJ.classList.remove("active-tab");
  loadWeatherBtnTJ.classList.remove("active-tab");
}

function showMainViewBJ() {
  mainView.style.display = "block";
  aboutScreen.style.display = "none";
  forecastDiv.style.display = "block"; // so 5-day buttons remain visible
  loadWeatherBtnBJ.classList.add("active-tab");
  aboutBtn.classList.remove("active-tab");
  loadWeatherBtnCA.classList.remove("active-tab");
  loadWeatherBtnTJ.classList.remove("active-tab");
}

function showMainViewTJ() {
  mainView.style.display = "block";
  aboutScreen.style.display = "none";
  forecastDiv.style.display = "block"; // so 5-day buttons remain visible
  loadWeatherBtnTJ.classList.add("active-tab");
  aboutBtn.classList.remove("active-tab");
  loadWeatherBtnCA.classList.remove("active-tab");
  loadWeatherBtnBJ.classList.remove("active-tab");
}


function showAboutView() {
  mainView.style.display = "none";
  forecastDiv.style.display = "none";
  aboutScreen.style.display = "block";
  aboutBtn.classList.add("active-tab");
  // forecastTabBtn.classList.remove("active-tab");
  loadWeatherBtnCA.classList.remove("active-tab");
  loadWeatherBtnBJ.classList.remove("active-tab");
  loadWeatherBtnTJ.classList.remove("active-tab");
}

// Tab-like behavior
aboutBtn.addEventListener("click", showAboutView);
loadWeatherBtnCA.addEventListener("click", showMainViewCA);
loadWeatherBtnBJ.addEventListener("click", showMainViewBJ);
loadWeatherBtnTJ.addEventListener("click", showMainViewTJ);
