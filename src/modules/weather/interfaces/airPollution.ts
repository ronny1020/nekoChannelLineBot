export interface AirPollutionData {
  coord: number[]
  list: AirPollutionList[]
}

export interface AirPollutionList {
  dt: number
  main: AirPollutionMain
  components: AirPollutionComponents
}

export interface AirPollutionMain {
  aqi: 1 | 2 | 3 | 4 | 5
}

export interface AirPollutionComponents {
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
}
