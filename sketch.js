let amplitude, song;
let weatherData = { temp: 20, humidity: 50, wind: 1 };
let isReady = false;

function preload() {
  // Don't preload anything here initially - let p5.js start quickly
  // We'll load sounds dynamically when weather is selected
}

function setup() {
  let cnv = createCanvas(windowWidth, 400);
  cnv.parent('canvasContainer');
  amplitude = new p5.Amplitude();
  frameRate(30);
  isReady = true;
  console.log('p5.js is ready!'); // You should see this when loading is done
}

function draw() {
  background(map(weatherData.temp, 0, 40, 180, 255), map(weatherData.humidity, 0, 100, 180, 255), 255);

  let level = amplitude.getLevel();
  let size = map(level, 0, 1, 10, 100);

  noStroke();
  fill(map(weatherData.wind, 0, 15, 100, 255), 100, 200, 150);
  ellipse(width / 2 + sin(frameCount * 0.05) * 100, height / 2, size, size);
}

function updateWeatherVisuals(temp, humidity, wind) {
  weatherData.temp = temp;
  weatherData.humidity = humidity;
  weatherData.wind = wind;
}