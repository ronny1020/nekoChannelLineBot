import { gql } from 'apollo-server-express'
import MemeModels from 'modules/meme/services/MemeModels'

export const typeDefs = gql`
  type Query {
    Memes: [Meme]
  }

  type Meme {
    id: String
    imageUrl: String!
    keywords: [String!]!
  }
`

export const resolvers = {
  Query: {
    Memes: async () => MemeModels.find({}),
  },
}
