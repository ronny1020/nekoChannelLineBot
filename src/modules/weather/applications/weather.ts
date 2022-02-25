import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '@utility/services/line/createFlexTextMessage'
import getCityInfo from '../domain/getCityInfo'
import getWeatherInfoFromApi from '../services/OpenWeatherMapApi/getWeatherInfoFromApi'

export default async function weather(
  message: string
): Promise<TextMessage | FlexMessage | undefined> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  if (!message.endsWith('天氣') && !message.endsWith('weather')) {
    return undefined
  }

  const cityName = message.replace(/天氣|weather/, '').trim()

  const city = getCityInfo(cityName)

  if (!city) {
    return undefined
  }

  const data = await getWeatherInfoFromApi(city.key)

  return createBubbleFlexTextMessage(
    {
      title: `${city.name}天氣`,
      subTitle: data.weather[0].description,
      contents: [
        { key: '現在溫度', value: `${data.main.temp} 度` },
        { key: '體感溫度', value: `${data.main.feels_like} 度` },
        // don't use empty string
        {
          key: ' ',
          value: `(最高 ${data.main.temp_max} 度 ~ 最低 ${data.main.temp_min} 度)`,
        },
        { key: '大氣壓力', value: `${data.main.pressure} mb` },
        { key: '相對濕度', value: `${data.main.humidity} %` },
        { key: '能見度', value: `${data.visibility} 公尺` },
      ],
    },
    `${city.name}天氣`
  )
}
