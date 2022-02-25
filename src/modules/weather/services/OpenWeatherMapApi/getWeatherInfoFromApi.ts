import { WeatherData } from '@modules/weather/interfaces/weather'
import axios from 'axios'

export default async function getWeatherInfoFromApi(
  city: string
): Promise<WeatherData> {
  const { data }: { data: WeatherData } = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )

  return data
}
