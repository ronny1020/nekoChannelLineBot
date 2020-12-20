import { middleware, MiddlewareConfig } from '@line/bot-sdk'

import express = require('express')

import { connectToMongo } from './mongo'
import handleEvent, { config } from './handleEvent'
import testForDev from './testForDev'

const app = express()

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
