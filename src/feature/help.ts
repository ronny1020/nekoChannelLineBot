import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '../tool/createMessage'

export default async function help(
  message: string
): Promise<TextMessage | undefined> {
  if (message.toLowerCase() !== '!help') {
    return undefined
  }

  return createTextMessage(
    [
      '!GOOGLE keyword',
      'GOOGLE SEARCH keyword',
      '!YOUTUBE keyword',
      'YOUTUBE SEARCH keyword',
      '最新地震',
      '#LIST [keyword]',
      '#meme',
      '新增 keyword imageUrl',
      'imageUrl',
      'PTT表特',
      'keyword 股價',
      '翻譯 something',
      'weather',
      '[台北]天氣',
      '台南天氣',
      '!WIKI keyword',
      'WIKI keyword',
    ].join('\n')
  )
}
