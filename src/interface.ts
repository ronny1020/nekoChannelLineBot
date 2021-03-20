import { Document } from 'mongoose'

export interface MemeSize {
  height: number
  width: number
}
export interface OriginalMeme {
  keywords: [string]
  imageUrl: string
  animated?: boolean
  size?: MemeSize
}
export interface Meme extends Document, OriginalMeme {
  _id: string
}
