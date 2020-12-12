import mongoose from 'mongoose'

const MemeSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: {
    type: [String],
  },
})

export const Memes = mongoose.model('Meme', MemeSchema)
