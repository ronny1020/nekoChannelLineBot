import { Message, MessageEvent, TextEventMessage } from '@line/bot-sdk'
import earthquake from 'modules/earthquake'
import google from 'modules/google'
import help from 'modules/help'
import meme from 'modules/meme/applications/meme'
import postImage from 'modules/postImage/applications/postImage'
import pttBeauty from 'modules/pttBeauty'
import stockPrice from 'modules/stockPrice'
import translate from 'modules/translate'
import airPollution from 'modules/weather/application/airPollution'
import weather from 'modules/weather/application/weather'
import weatherForecast from 'modules/weather/application/weatherForecast'
import wiki from 'modules/wiki'
import youtube from 'modules/youtube'

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
