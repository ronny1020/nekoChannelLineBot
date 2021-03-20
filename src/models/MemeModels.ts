import mongoose, { Schema, Model } from 'mongoose'
import { Meme } from '../interface'

const MemeSchema: Schema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: [String],
  animated: Boolean,
  size: {
    height: Number,
    width: Number,
  },
})

export default mongoose.model('Meme', MemeSchema) as Model<Meme>
