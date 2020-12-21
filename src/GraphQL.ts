import { buildSchema } from 'graphql'
import { MemeModels } from './models/MemeModels'

export const schema = buildSchema(`
  type Query {
    Memes:[Meme]
  }

  type Meme {
    id: String
    imageUrl: String!
    keywords: [String!]!
  }
`)

export const root = {
  async Memes() {
    const memes = await MemeModels.find({})
    return memes
  },
}
