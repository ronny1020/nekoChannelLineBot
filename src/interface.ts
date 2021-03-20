import { Document } from 'mongoose'

export interface MemeSize {
  height: number
  width: number
}

export interface ImageType {
  animated?: boolean
  size?: MemeSize
}
export interface OriginalMeme extends ImageType {
  keywords: [string]
  imageUrl: string
}
export interface Meme extends Document, OriginalMeme {
  _id: string
}
