import { convertWeatherData } from './weatherDataConverter.mjs';
import fs from 'fs';

// Read the example data from file
try {
  const rawData = fs.readFileSync('./example_api_data.json', 'utf8');
  const apiData = JSON.parse(rawData);
  
  // Convert the data
  const convertedData = convertWeatherData(apiData);
  
  // Output the result
  console.log('Converted Weather Data:');
  console.log(JSON.stringify(convertedData, null, 2));
  
  // Optionally save to a file
  fs.writeFileSync('./converted_output.json', JSON.stringify(convertedData, null, 2));
  console.log('\nConverted data saved to converted_output.json');
  
} catch (error) {
  console.error('Error processing weather data:', error.message);
}