import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'
import fs from 'fs'

export default async function version(
  message: string
): Promise<TextMessage | undefined> {
  if (message.toLowerCase() !== '!version') {
    return undefined
  }

  let appVersion = ''
  try {
    appVersion =
      fs.readFileSync('version.txt', 'utf8') || 'version.txt is empty'
  } catch (err) {
    appVersion = 'version.txt not found'
  }
  return createTextMessage(appVersion)
}
