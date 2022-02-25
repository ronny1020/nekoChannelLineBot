import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '@utility/services/line/createFlexTextMessage'
import getCityInfo from '../domain/getCityInfo'
import getAirPollutionFromApi from '../services/OpenWeatherMapApi/getAirPollutionFromApi'

const pollutionLevel = {
  '1': 'Good',
  '2': 'Fair',
  '3': 'Moderate',
  '4': 'Poor',
  '5': 'Very Poor',
}

const dataOrder = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3']

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

  const data = await getAirPollutionFromApi(lat, lon)

  const formattedComponents = Object.fromEntries(
    Object.entries(data.list[0].components).map(([key, value]) => [
      key,
      `${value.toFixed(2)} μg/m3`,
    ])
  )

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
