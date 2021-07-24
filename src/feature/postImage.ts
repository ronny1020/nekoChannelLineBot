import { FlexMessage, ImageMessage, TextMessage } from '@line/bot-sdk'
import checkImageType from '../tool/checkImageType'
import createAnimatedImageMessage from '../tool/createAnimatedImageMessage'
import { createTextMessage } from '../tool/createMessage'

const filenameExtensionList: string[] = ['.png', '.jpg', '.jpeg', '.gif']

export function findImageUrlFromText(text: string): string {
  const regex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/g
  const match = text.match(regex)

  return match ? match[0] : ''
}

export function findImageExtensionForText(text: string): string {
  return (
    filenameExtensionList.find((item) => text.toLowerCase().includes(item)) ||
    ''
  )
}

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
