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

export default mongoose.model('Meme', MemeSchema) as Model<Meme>
