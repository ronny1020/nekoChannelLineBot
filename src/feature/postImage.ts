import { ImageMessage } from '@line/bot-sdk'
import { createImageMessage } from '../tool/createMessage'

export default async function postImage(
  message: string
): Promise<ImageMessage | undefined> {
  const lowerCaseMessage = message.toLowerCase()
  const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png']

  if (message.includes('http') && !message.startsWith('新增')) {
    for (const extension of filenameExtensionList) {
      if (lowerCaseMessage.includes(extension)) {
        return createImageMessage(
          message.substring(
            message.indexOf('http'),
            message.lastIndexOf(extension) + extension.length
          )
        )
      }
    }
  }

  return
}
