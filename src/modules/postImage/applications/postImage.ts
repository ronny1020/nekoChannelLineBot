import { FlexMessage, ImageMessage, TextMessage } from '@line/bot-sdk'
import checkImageType from '@utility/libs/checkImageType'
import createAnimatedImageMessage from '@utility/services/line/createAnimatedImageMessage'
import { createTextMessage } from '@utility/services/line/createMessage'
import findImageExtensionForText from '../domain/findImageExtensionForText'
import findImageUrlFromText from '../domain/findImageUrlFromText'

export default async function postImage(
  message: string
): Promise<TextMessage | ImageMessage | FlexMessage | undefined> {
  if (message.includes('http') && !message.startsWith('新增')) {
    const extension = findImageExtensionForText(message)

    if (extension) {
      const imageUrl = findImageUrlFromText(message)

      const imageType = await checkImageType(imageUrl, extension)
      if (typeof imageType === 'string') return createTextMessage(imageType)

      const { animated, size } = imageType

      return createAnimatedImageMessage(imageUrl, animated, size)
    }
  }
  return undefined
}
