import axios from 'axios'
import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { AirPollutionData } from '../interface/airPollution'
import createCommonTextMessage from '../tool/createCommonTextMessage'

export default async function airPollution(
  message: string
): Promise<TextMessage | FlexMessage | undefined> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  let lat: number
  let lon: number
  let cityName = ''
  switch (message) {
    case 'air pollution':
    case '空汙':
    case '台北空汙':
      lat = 25.033
      lon = 121.5654
      cityName = '台北'
      break
    case '台南空汙':
      lat = 22.9997
      lon = 120.227
      cityName = '台南'
      break
    default:
      return undefined
  }

  const pollutionLevel = {
    '1': 'Good',
    '2': 'Fair',
    '3': 'Moderate',
    '4': 'Poor',
    '5': 'Very Poor',
  }

  const { data } = (await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=25&lon=121.5&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: AirPollutionData }

  const formattedComponents = Object.fromEntries(
    Object.entries(data.list[0].components).map(([key, value]) => [
      key,
      `${value.toFixed(2)} μg/m3`,
    ])
  )

  const dataOrder = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3']

  return createCommonTextMessage(
    {
      title: `${cityName}空汙`,
      subTitle: pollutionLevel[data.list[0].main.aqi] || ' ',
      contents: dataOrder.map((value) => ({
        key: value.replace('_', '.').toUpperCase(),
        value: formattedComponents[value],
      })),
    },
    `${cityName}空汙`
  )
}
