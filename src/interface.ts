import { Document } from 'mongoose'

export interface Meme extends Document {
  keywords: [string]
  _id: string
  imageUrl: string
}
