import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'

export default async function version(
  message: string
): Promise<TextMessage | undefined> {
  if (message.toLowerCase() !== '!version') {
    return undefined
  }
  return createTextMessage(`https://github.com/ronny1020/nekoChannelLineBot/commit/${process.env.RENDER_GIT_COMMIT}` || 'no version found')
}
