import mongoose, { Schema, Model } from 'mongoose'
import { Meme } from '../interface'

const MemeSchema: Schema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: {
    type: [String],
  },
})

export const MemeModels: Model<Meme> = mongoose.model('Meme', MemeSchema)
