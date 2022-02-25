import { AirPollutionData } from '@modules/weather/interfaces/airPollution'
import axios from 'axios'

export default async function getAirPollutionFromApi(
  lat: number,
  lon: number
): Promise<AirPollutionData> {
  const { data }: { data: AirPollutionData } = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )

  return data
}
