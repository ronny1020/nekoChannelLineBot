import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '@utility/services/line/createFlexTextMessage'
import axios from 'axios'
import { AirPollutionData } from 'modules/weather/interfaces/airPollution'
import getCityInfo from '../domain/getCityInfo'

const pollutionLevel = {
  '1': 'Good',
  '2': 'Fair',
  '3': 'Moderate',
  '4': 'Poor',
  '5': 'Very Poor',
}

export default async function airPollution(
  message: string
): Promise<TextMessage | FlexMessage | undefined> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  if (
    !message.endsWith('空汙') &&
    !message.endsWith('空氣汙染') &&
    !message.endsWith('air pollution')
  ) {
    return undefined
  }

  const cityName = message.replace(/空汙|空氣汙染|air pollution/, '').trim()

  const city = getCityInfo(cityName)

  if (!city) {
    return undefined
  }

  const { lat, lon } = city

  const { data } = (await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: AirPollutionData }

  const formattedComponents = Object.fromEntries(
    Object.entries(data.list[0].components).map(([key, value]) => [
      key,
      `${value.toFixed(2)} μg/m3`,
    ])
  )

  const dataOrder = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3']

  return createBubbleFlexTextMessage(
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
