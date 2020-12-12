import { ImageMessage } from '@line/bot-sdk'
import { createImageMessage } from '../tool/createMessage'
import { Memes } from '../models/MemeModels'

export default async function meme(
  message: string
): Promise<ImageMessage | undefined> {
  if (message === 'm') {
    const memes = await Memes.find({}).catch((e) => console.error(e))

    console.log(memes)
  }

  return
}
