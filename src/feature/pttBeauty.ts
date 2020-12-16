import axios from 'axios'
import cheerio from 'cheerio'

import { TextMessage } from '@line/bot-sdk'

import { createTextMessage } from '../tool/createMessage'

export default async function pttBeauty(
  message: string
): Promise<TextMessage | undefined> {
  if (message === 'b') {
    try {
      const url = 'https://www.ptt.cc/bbs/Beauty/M.1603022191.A.5BE.html'

      const { data } = await axios.request({
        url: url,
        method: 'get',
        headers: {
          Cookie: 'over18=1',
        },
      })

      const imageLinkRegexp = /(http)?s?:?(\/\/[^"'\n]*\.(?:png|jpg|jpeg))/g

      const imagesUrlList: string[] = data.match(imageLinkRegexp)

      console.log(
        imagesUrlList.filter(
          (link, index) => imagesUrlList.indexOf(link) === index
        )
      )
      // const $ = cheerio.load(data)
      // const linkElements = $('a[target="_blank"]')

      // const imagesUrlList = linkElements.map((index, element) =>
      //   console.log($(element).attr('href'))
      // )
      // console.log(imagesUrlList)
    } catch {
      createTextMessage('無法順利連線')
    }

    return createTextMessage('b')
  }
  return
}
