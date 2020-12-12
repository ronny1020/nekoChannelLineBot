import { ImageMessage, TextMessage } from '@line/bot-sdk'

export function createTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text: text,
  }
}

export function createImageMessage(ImageUrl: string): ImageMessage {
  return {
    type: 'image',
    originalContentUrl: ImageUrl,
    previewImageUrl: ImageUrl,
  }
}
