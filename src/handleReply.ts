import { Message } from '@line/bot-sdk'

import google from './feature/google'
import wiki from './feature/wiki'
import weather from './feature/weather'
import postImage from './feature/postImage'
import translate from './feature/translate'
import meme from './feature/meme'

export default async function handleReply(
  message: string
): Promise<Message | undefined> {
  message = message.trim()

  return (
    (await google(message)) ||
    (await wiki(message)) ||
    (await weather(message)) ||
    (await translate(message)) ||
    (await postImage(message)) ||
    // meme must be the last one
    (await meme(message)) ||
    undefined
  )
}
