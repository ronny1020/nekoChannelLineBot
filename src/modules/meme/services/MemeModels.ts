import mongoose, { Schema } from 'mongoose'
import { Meme } from '../interfaces/meme'

const MemeSchema: Schema = new mongoose.Schema<Meme>({
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

export default mongoose.model('Meme', MemeSchema)
