import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '../tool/createMessage'

export default async function google(
  message: string
): Promise<TextMessage | undefined> {
  if (message.substr(0, 6).toLowerCase() === 'google') {
    return createTextMessage(
      'https://www.google.com/search?q=' + message.substr(7).replace(' ', '+')
    )
  }
  return
}
