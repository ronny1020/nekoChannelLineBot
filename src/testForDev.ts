import { Message, MessageEvent } from '@line/bot-sdk'
import { stdin, stdout } from 'process'
import { createInterface } from 'readline'
import handleReply from './handleReply'

const readlineInterface = createInterface({
  input: stdin,
  output: stdout,
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
