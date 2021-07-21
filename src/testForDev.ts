import { Message, MessageEvent } from '@line/bot-sdk'
import * as readline from 'readline'
import handleReply from './handleReply'

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export default function testForDev() {
  readlineInterface.question('Message:', async (text: string) => {
    const event: MessageEvent = {
      type: 'message',
      replyToken: 'replyToken',
      message: { type: 'text', id: '', text },
      mode: 'active',
      timestamp: 0,
      source: {
        type: 'group',
        groupId: 'string',
      },
    }

    const echo: Message | undefined = await handleReply(event)
    console.log(echo)
    testForDev()
  })
}
