import axios from 'axios'
import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '../tool/createFlexTextMessage'
import { WeatherData } from '../interface/weather'

export default async function weather(
  message: string
): Promise<TextMessage | FlexMessage | undefined> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  let city = ''
  let cityName = ''
  switch (message.toLowerCase()) {
    case 'weather':
    case '天氣':
    case '台北天氣':
      city = 'Taipei'
      cityName = '台北'
      break
    case '台南天氣':
      city = 'Tainan'
      cityName = '台南'
      break
    default:
      return undefined
  }

  const { data } = (await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: WeatherData }

  return createBubbleFlexTextMessage(
    {
      title: `${cityName}天氣`,
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
    `${cityName}天氣`
  )
}
