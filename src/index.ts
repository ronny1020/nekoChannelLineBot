import {
  Config,
  Client,
  ClientConfig,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  Message,
} from '@line/bot-sdk'

import express = require('express')
import mongoose, { connect } from 'mongoose'

import * as dotenv from 'dotenv'

import * as readline from 'readline'

import handleReply from './handleReply'

dotenv.config()

const config: Config = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
}
// create LINE SDK client
const client = new Client(<ClientConfig>config)
// create Express app
// about Express itself: https://expressjs.com/
const app = express()
// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', middleware(<MiddlewareConfig>config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})
// event handler
async function handleEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }
  console.log(`Received message: ${event.message.text}`)
  // create a echoing text message

  const echo: Message | undefined = await handleReply(event.message.text)

  // use reply API
  if (!echo) return Promise.resolve(null)
  return client.replyMessage(event.replyToken, echo)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function test() {
  rl.question('Message:', async (message) => {
    const echo: Message | undefined = await handleReply(message)
    console.log(echo)
    test()
  })
}

async function init() {
  // listen on port
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`listening on ${port}`)
  })

  // connect to mongoDB
  const url = process.env.MONGO_DB_URL || ''

  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB has connected'))
    .catch((e) => console.error(e))

  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))

  test()
}

init()
