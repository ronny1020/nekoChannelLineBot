import { ForecastData, Daily } from '@modules/weather/interfaces/weather'
import axios from 'axios'

export default async function getForecastFromApi(
  lat: number,
  lon: number
): Promise<Daily[]> {
  const {
    data: { daily },
  }: { data: ForecastData } = (await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: ForecastData }

  return daily
}
