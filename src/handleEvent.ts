import {
  Client,
  ClientConfig,
  Config,
  Message,
  WebhookEvent,
} from '@line/bot-sdk'
import * as dotenv from 'dotenv'
import handleReply from './handleReply'

dotenv.config()

export const config: Config = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
}

const client = new Client(<ClientConfig>config)

export default async function handleEvent(event: WebhookEvent) {
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
