import {
  ImageMessage,
  TextMessage,
  FlexMessage,
  FlexContainer,
} from '@line/bot-sdk'

export function createTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text,
  }
}

export function createImageMessage(ImageUrl: string): ImageMessage {
  return {
    type: 'image',
    originalContentUrl: ImageUrl,
    previewImageUrl: ImageUrl,
  }
}

export function createFlexMessage(
  contents: FlexContainer,
  altText = 'FlexMessage'
): FlexMessage {
  return {
    type: 'flex',
    altText,
    contents,
  }
}
