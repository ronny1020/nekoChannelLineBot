import { middleware, MiddlewareConfig } from '@line/bot-sdk'
import { graphqlHTTP } from 'express-graphql'
import express from 'express'
import handleEvent, { config } from './handleEvent'
import testForDev from './testForDev'
import { root, schema } from './GraphQL'
import connectToMongo from './mongo'

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
)

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
