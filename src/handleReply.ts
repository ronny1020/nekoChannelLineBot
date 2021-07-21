import { Message } from '@line/bot-sdk'

import google from './feature/google'
import youtube from './feature/youtube'
import wiki from './feature/wiki'
import weather from './feature/weather'
import weatherForecast from './feature/weatherForecast'
import airPollution from './feature/airPollution'
import postImage from './feature/postImage'
import translate from './feature/translate'
import meme from './feature/meme'
import pttBeauty from './feature/pttBeauty'
import stockPrice from './feature/stockPrice'
import earthquake from './feature/earthquake'
import help from './feature/help'

export default async function handleReply(
  originalMessage: string
): Promise<Message | undefined> {
  const message = originalMessage.trim()

  return (
    (await stockPrice(message)) ||
    (await google(message)) ||
    (await youtube(message)) ||
    (await wiki(message)) ||
    (await weather(message)) ||
    (await weatherForecast(message)) ||
    (await airPollution(message)) ||
    (await translate(message)) ||
    (await postImage(message)) ||
    (await pttBeauty(message)) ||
    (await earthquake(message)) ||
    (await meme(message)) ||
    (await help(message)) ||
    undefined
  )
}
