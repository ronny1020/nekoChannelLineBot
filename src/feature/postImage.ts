import { FlexMessage, ImageMessage, TextMessage } from '@line/bot-sdk'
import checkImageType from '../tool/checkImageType'
import createAnimatedImageMessage from '../tool/createAnimatedImageMessage'
import { createTextMessage } from '../tool/createMessage'

export default async function postImage(
  message: string
): Promise<TextMessage | ImageMessage | FlexMessage | undefined> {
  const lowerCaseMessage = message.toLowerCase()
  const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png', 'gif']

  if (message.includes('http') && !message.startsWith('新增')) {
    const extension = filenameExtensionList.find((item) =>
      lowerCaseMessage.includes(item)
    )

    if (extension) {
      const imageUrl = message.substring(
        message.indexOf('http'),
        message.lastIndexOf(extension) + extension.length
      )

      const imageType = await checkImageType(imageUrl, extension)
      if (typeof imageType === 'string') return createTextMessage(imageType)

      const { animated, size } = imageType

      return createAnimatedImageMessage(imageUrl, animated, size)
    }
  }
  return undefined
}
