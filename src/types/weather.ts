export interface WeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  coord: {
    lon: number;
    lat: number;
  };
}

export interface CityGeoResponse {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}