import axios from 'axios'

export default async function weather(message: string): Promise<string> {
  if (
    ['weather', '天氣', '台北天氣'].includes(message) &&
    process.env.OPEN_WEATHER_API_KEY
  ) {
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=Taipei&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=zh_tw&units=metric`
    )

    return `台北現在天氣${data.weather[0].description}
現在溫度 ${data.main.temp} 度
體感溫度 ${data.main.feels_like} 度
(最高 ${data.main.temp_min} 度 ~ 最低 ${data.main.temp_max} 度)
大氣壓力 ${data.main.pressure} mb
相對濕度 ${data.main.humidity} %
能見度     ${data.visibility} 公尺`
  }

  return ''
}
