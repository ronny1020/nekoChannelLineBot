import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '@utility/services/line/createFlexTextMessage'
import axios from 'axios'
import weatherCityList from '../domain/weatherCityList'
import { WeatherData } from '../interfaces/weather'

export default async function weather(
  message: string
): Promise<TextMessage | FlexMessage | undefined> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  if (message !== 'weather' && !message.match(/天氣$/)) {
    return undefined
  }
  const cityName = message.replace(/天氣/, '')
  const city =
    weatherCityList.find((item) => item.name === cityName) || weatherCityList[0]

  const { data } = (await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${city.key}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: WeatherData }

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
