import { Message, TextMessage, ImageMessage } from '@line/bot-sdk'

import google from './feature/google'
import weather from './feature/weather'
import postImage from './feature/postImage'
import translate from './feature/translate'

export default async function handleReply(
  message: string
): Promise<Message | null> {
  message = message.trim()
  const text: string =
    (await google(message)) ||
    (await weather(message)) ||
    (await translate(message)) ||
    ''

  if (text) {
    const textMessage: TextMessage = {
      type: 'text',
      text: text,
    }
    return textMessage
  }

  const ImageUrl: string = (await postImage(message)) || ''

  if (ImageUrl) {
    const imageMessage: ImageMessage = {
      type: 'image',
      originalContentUrl: ImageUrl,
      previewImageUrl: ImageUrl,
    }
    return imageMessage
  }

  return null
}
