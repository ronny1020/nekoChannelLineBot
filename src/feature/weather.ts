import axios from 'axios'
import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createFlexMessage } from '../tool/createMessage'

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
      break
  }

  const { data } = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )

  return createFlexMessage(
    {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: `${cityName}天氣`,
                size: 'xl',
                color: '#555555',
                flex: 0,
                weight: 'bold',
              },
              {
                type: 'text',
                text: data.weather[0].description,
                size: 'xl',
                color: '#111111',
                align: 'end',
              },
            ],
          },
          {
            type: 'separator',
            margin: 'xs',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '現在溫度',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                  },
                  {
                    type: 'text',
                    text: `${data.main.temp} 度`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: '體感溫度',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                  },
                  {
                    type: 'text',
                    text: `${data.main.feels_like} 度`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                    text: ' ',
                  },
                  {
                    type: 'text',
                    text: `(最高 ${data.main.temp_max} 度 ~ 最低 ${data.main.temp_min} 度)`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                    text: '大氣壓力',
                  },
                  {
                    type: 'text',
                    text: `${data.main.pressure} mb`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                    text: '相對濕度',
                  },
                  {
                    type: 'text',
                    text: `${data.main.humidity} %`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    size: 'sm',
                    color: '#555555',
                    flex: 0,
                    text: '能見度',
                  },
                  {
                    type: 'text',
                    text: `${data.visibility} 公尺`,
                    size: 'sm',
                    color: '#111111',
                    align: 'end',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    '台南天氣'
  )
}
