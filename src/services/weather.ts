const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function getWeatherByCity(city: string) {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchCities(query: string) {
  if (query.length < 3 || !API_KEY) return [];
  try {
    const res = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}