export interface WeatherData {
  coord: Coord
  weather: Weather[]
  base: string
  main: WeatherMain
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Clouds {
  all: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface WeatherMain {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export interface Sys {
  type: number
  id: number
  message: number
  country: string
  sunrise: number
  sunset: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Wind {
  speed: number
  deg: number
}

export interface ForecastData {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: Current
  minutely: Minutely[]
  hourly: Current[]
  daily: Daily[]
}

export interface Current {
  dt: number
  sunrise?: number
  sunset?: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  weather: Weather[]
  wind_gust?: number
  pop?: number
}

export interface Daily {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  temp: Temp
  feels_like: FeelsLike
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Weather[]
  clouds: number
  pop: number
  uvi: number
  rain?: number
}

export interface FeelsLike {
  day: number
  night: number
  eve: number
  morn: number
}

export interface Temp {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}

export interface Minutely {
  dt: number
  precipitation: number
}

export interface WeatherCity {
  key: string
  name: string
  lon: number
  lat: number
}
