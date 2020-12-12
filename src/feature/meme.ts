import { ImageMessage } from '@line/bot-sdk'
import { createImageMessage } from '../tool/createMessage'
import { MemeModels } from '../models/MemeModels'
import { Meme } from '../interface'

let memes: Meme[] | undefined

export default async function meme(
  message: string
): Promise<ImageMessage | undefined> {
  if (!memes) {
    console.log('re')
    memes = await MemeModels.find({})
  }

  for (const meme of memes) {
    for (const keyword of meme.keywords) {
      if (keyword === message) {
        return createImageMessage(meme.imageUrl)
      }
    }
  }

  return
}
