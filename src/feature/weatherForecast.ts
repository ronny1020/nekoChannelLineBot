import axios from 'axios'
import { TextMessage, FlexMessage } from '@line/bot-sdk'
import moment from 'moment'
import { ForecastData } from '../interface/weather'
import { locationMapping } from '../tool/location'
import { createCarouselFlexTextMessage } from '../tool/createFlexTextMessage'

function uviLevel(uvi: number) {
  if (uvi < 3) return '低量'
  if (uvi < 6) return '中量'
  if (uvi < 8) return '高量'
  if (uvi < 1) return '過量'
  return '危險'
}

function getWindDirection(wind_deg: number) {
  const windDegreePercentage = wind_deg / 360
  if (windDegreePercentage < 1 / 32) return '北'
  if (windDegreePercentage < 3 / 32) return '北北東'
  if (windDegreePercentage < 5 / 32) return '東北'
  if (windDegreePercentage < 7 / 32) return '東北東'
  if (windDegreePercentage < 9 / 32) return '東'
  if (windDegreePercentage < 11 / 32) return '東南東'
  if (windDegreePercentage < 13 / 32) return '東南'
  if (windDegreePercentage < 15 / 32) return '南南東'
  if (windDegreePercentage < 17 / 32) return '南東'
  if (windDegreePercentage < 19 / 32) return '南'
  if (windDegreePercentage < 21 / 32) return '南南西'
  if (windDegreePercentage < 23 / 32) return '西南'
  if (windDegreePercentage < 25 / 32) return '西南西'
  if (windDegreePercentage < 27 / 32) return '西'
  if (windDegreePercentage < 29 / 32) return '西北西'
  if (windDegreePercentage < 31 / 32) return '西北'
  return '北'
}

export default async function weatherForecast(
  message: string
): Promise<undefined | TextMessage | FlexMessage> {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    return undefined
  }

  let cityName = ''
  let locationKey: 'taipei' | 'tainan'

  switch (message) {
    case 'weather forecast':
    case '天氣預報':
    case '台北天氣預報':
      locationKey = 'taipei'
      cityName = '台北'
      break
    case '台南天氣預報':
      locationKey = 'tainan'
      cityName = '台南'
      break
    default:
      return undefined
  }

  const { lat, lon } = locationMapping[locationKey]

  const {
    data: { daily },
  } = (await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
  )) as { data: ForecastData }

  return createCarouselFlexTextMessage(
    daily.map((day) => ({
      title: moment(day.dt * 1000).format('Do ddd'),
      subTitle: day.weather[0].description,
      titleIconUrl: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
      contents: [
        { key: '降雨機率', value: `${(day.pop * 100).toFixed()} %` },
        { key: '雲量', value: `${day.clouds} %` },
        { key: '紫外線指數', value: `${day.uvi} ${uviLevel(day.uvi)}` },
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
        { key: ' ', value: cityName },
      ],
    })),
    `${cityName}天氣預報`
  )
}
