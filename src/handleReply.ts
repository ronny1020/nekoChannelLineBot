import { Message, MessageEvent, TextEventMessage } from '@line/bot-sdk'
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
  event: MessageEvent
): Promise<Message | undefined> {
  const message = event.message as TextEventMessage
  const text: string = message.text.trim()

  return (
    (await stockPrice(text)) ||
    (await google(text)) ||
    (await youtube(text)) ||
    (await wiki(text)) ||
    (await weather(text)) ||
    (await weatherForecast(text)) ||
    (await airPollution(text)) ||
    (await translate(text)) ||
    (await postImage(text)) ||
    (await pttBeauty(text)) ||
    (await earthquake(text)) ||
    (await meme(text)) ||
    (await help(text)) ||
    undefined
  )
}
