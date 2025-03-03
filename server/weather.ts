const API_KEY = process.env.WEATHER_API_KEY || "demo_key";
const BASE_URL = "http://api.weatherapi.com/v1";

export async function getWeather(location: string) {
  const response = await fetch(
    `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  
  return {
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    rainfall: data.current.precip_mm,
  };
}
