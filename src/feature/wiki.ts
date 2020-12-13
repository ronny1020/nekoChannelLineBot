import axios from 'axios'
import cheerio from 'cheerio'

import { TextMessage } from '@line/bot-sdk'

import { createTextMessage } from '../tool/createMessage'

export default async function wiki(
  message: string
): Promise<TextMessage | undefined> {
  if (message.substr(0, 4).toLowerCase() === 'wiki') {
    const keyword = message.substring(4).trim()
    const wikiUrl = `https://zh.wikipedia.org/wiki/${encodeURI(keyword)}`

    try {
      const { data } = await axios.request({
        url: wikiUrl,
        method: 'get',
        headers: {
          'accept-language': 'en-US,en;zh-TW',
        },
      })

      const $ = cheerio.load(data)

      const elements = $('#mw-content-text .mw-parser-output').children()

      const selectedElements = elements.slice(
        elements.index($('p')),
        elements.index($('.toc'))
      )
      const messageText =
        selectedElements
          .text()
          .replace(/\[\d*\]/g, '')
          .trim() +
        '\n\n' +
        wikiUrl

      return createTextMessage(messageText)
    } catch (error) {
      return createTextMessage(`WIKI 上找不到條目:${keyword}`)
    }
  }
  return
}
