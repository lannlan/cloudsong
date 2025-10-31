# CloudSong

A weather forecast web application that plays self-recorded guzheng, a traditional Chinese plucked zither instrument, and animation corresponding to different weather conditions.

## Description

This website  transforms real-time weather data from OpenWeatherMap API into traditional self-recorded Chinese guzheng melodies, creating a unique way for families separated by distance to share the same sky. When it's drizzling in San Francisco, the site plays an animation of me performing guzheng underneath the rain at the Golden Gate Bridge with a five-day forecast below.

CloudSong was originally built for my grandparents after they returned to China. They've shared it with their neighbors and friends, making it now a connector of communities.

## Technical Components

* AWS EC2 virtual machine for hosting the website.
* Nginx web server in the VM that serves the application page.
* OpenWeatherMap API for realtime wather data.
* Vue.js JavaScript framework.
* Cloudflare for HTTPS protocol and security


## Version History

* 2
    * Redesign with syncronised music and animation
    * Support Chinese and English languages
* 1
    * Initial Release
