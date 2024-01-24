import { Message, MessageEvent, TextEventMessage } from '@line/bot-sdk'
import earthquake from '@modules/earthquake'
import google from '@modules/google'
import gpt from '@modules/gpt'
import help from '@modules/help'
import meme from '@modules/meme/applications/meme'
import postImage from '@modules/postImage/applications/postImage'
import pttBeauty from '@modules/pttBeauty'
import stockPrice from '@modules/stockPrice'
import translate from '@modules/translate'
import version from '@modules/version'
import airPollution from '@modules/weather/applications/airPollution'
import weather from '@modules/weather/applications/weather'
import weatherForecast from '@modules/weather/applications/weatherForecast'
import wiki from '@modules/wiki'
import youtube from '@modules/youtube'

export default async function handleReply(
  event: MessageEvent
): Promise<Message | undefined> {
  const message = event.message as TextEventMessage
  const text: string = message.text.trim()
  const userId = event.source.userId || ''

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
    (await gpt(text, userId)) ||
    (await version(text)) ||
    undefined
  )
}
