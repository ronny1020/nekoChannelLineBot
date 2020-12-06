import {
  Config,
  Client,
  ClientConfig,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
} from '@line/bot-sdk'

import express = require('express')

const config: Config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
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
function handleEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }
  console.log(`Received message: ${event.message.text}`)
  // create a echoing text message
  const echo: TextMessage = { type: 'text', text: event.message.text }
  // use reply API
  return client.replyMessage(event.replyToken, echo)
}
// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
