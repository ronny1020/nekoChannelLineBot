import { middleware, MiddlewareConfig } from '@line/bot-sdk'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import handleEvent, { config } from './handleEvent'
import testForDev from './testForDev'
import { root, schema } from './GraphQL'
import connectToMongo from './mongo'

const app = express()

const server = new ApolloServer({
  schema,
  rootValue: root,
})

server.applyMiddleware({ app })

app.post('/callback', middleware(<MiddlewareConfig>config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

async function init() {
  // listen on port
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`listening on ${port}`)
  })

  await connectToMongo()

  testForDev()
}

init()
