import { FlexMessage, ImageMessage } from '@line/bot-sdk'
import { createFlexMessage, createImageMessage } from './createMessage'
import { MemeSize } from '../../../modules/meme/interfaces/meme'

export default function createAnimatedImageMessage(
  imageUrl: string,
  animated = false,
  size: MemeSize | undefined
): FlexMessage | ImageMessage {
  if (animated && size) {
    return createFlexMessage({
      type: 'bubble',
      hero: {
        type: 'image',
        url: imageUrl,
        size: 'full',
        aspectMode: 'fit',
        animated,
        aspectRatio: `${size.width}:${size.height}`,
        action: {
          type: 'uri',
          uri: imageUrl,
          label: 'open image',
        },
      },
    })
  }
  return createImageMessage(imageUrl)
}
