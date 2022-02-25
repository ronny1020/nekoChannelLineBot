import { TextMessage, FlexMessage } from '@line/bot-sdk'
import { createCarouselFlexTextMessage } from '@utility/services/line/createFlexTextMessage'
import moment from 'moment'
import getCityInfo from '../domain/getCityInfo'
import getUviLevelName from '../domain/getUviLevelName'
import getWindDirection from '../domain/getWindDirection'
import getForecastFromApi from '../services/OpenWeatherMapApi/getForecastFromApi'

export default async function weatherForecast(
  message: string
): Promise<undefined | TextMessage | FlexMessage> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  if (!message.endsWith('天氣預報') && !message.endsWith('forecast')) {
    return undefined
  }

  const cityName = message.replace(/天氣預報|weather|forecast/g, '').trim()

  const city = getCityInfo(cityName)

  if (!city) {
    return undefined
  }

  const { lat, lon } = city

  const daily = await getForecastFromApi(lat, lon)

  return createCarouselFlexTextMessage(
    daily.map((day) => ({
      title: moment(day.dt * 1000).format('Do ddd'),
      subTitle: day.weather[0].description,
      titleIconUrl: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
      contents: [
        { key: '降雨機率', value: `${(day.pop * 100).toFixed()} %` },
        { key: '雲量', value: `${day.clouds} %` },
        { key: '紫外線指數', value: `${day.uvi} ${getUviLevelName(day.uvi)}` },
        {
          key: '早晨溫度/體感',
          value: `${day.temp.morn.toFixed(2)} / ${day.feels_like.morn.toFixed(
            2
          )} 度`,
        },
        {
          key: '白天溫度/體感',
          value: `${day.temp.day.toFixed(2)} / ${day.feels_like.day.toFixed(
            2
          )} 度`,
        },
        {
          key: '傍晚溫度/體感',
          value: `${day.temp.eve.toFixed(2)} / ${day.feels_like.eve.toFixed(
            2
          )} 度`,
        },
        {
          key: '夜晚溫度/體感',
          value: `${day.temp.night.toFixed(2)} / ${day.feels_like.night.toFixed(
            2
          )} 度`,
        },
        {
          key: '溫度範圍 最低~最高',
          value: `${day.temp.min.toFixed(2)} ~ ${day.temp.max.toFixed(2)} 度`,
        },
        { key: '露點', value: `${day.dew_point.toFixed(2)} 度` },
        {
          key: '風速/陣風',
          value: `${day.wind_speed.toFixed(2)} / ${day.wind_gust.toFixed(
            2
          )} m/s`,
        },
        {
          key: '風向',
          value: `${day.wind_deg}度，${getWindDirection(day.wind_deg)}`,
        },
        { key: '大氣壓力', value: `${day.pressure} mb` },
        { key: '相對濕度', value: `${day.humidity} %` },
        { key: '月像', value: `${(day.moon_phase * 100).toFixed()} %` },
        {
          key: '日出/日落',
          value: `${moment(day.sunrise * 1000).format('HH:mm:ss')} / ${moment(
            day.sunset * 1000
          ).format('HH:mm:ss')}`,
        },
        'separator',
        { key: ' ', value: city.name },
      ],
    })),
    `${city.name}天氣預報`
  )
}
