import { Message } from '@line/bot-sdk'

import google from './feature/google'
import wiki from './feature/wiki'
import weather from './feature/weather'
import postImage from './feature/postImage'
import translate from './feature/translate'
import meme from './feature/meme'
import pttBeauty from './feature/pttBeauty'

export default async function handleReply(
  originalMessage: string
): Promise<Message | undefined> {
  const message = originalMessage.trim()

  return (
    (await google(message)) ||
    (await wiki(message)) ||
    (await weather(message)) ||
    (await translate(message)) ||
    (await postImage(message)) ||
    (await pttBeauty(message)) ||
    // meme must be the last one
    (await meme(message)) ||
    undefined
  )
}
