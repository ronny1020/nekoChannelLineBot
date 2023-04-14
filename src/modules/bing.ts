import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'
import axios from 'axios'
import WebSocket from 'ws'

declare type BingConversation = {
  invocationId: number
  conversationId: string
  clientId: string
  conversationSignature: string
}

const axiosInstance = axios.create({
  baseURL: 'https://www.bing.com',
  headers: {
    'content-type': 'application/json',
    referer: 'https://www.bing.com/',
    origin: 'https://www.bing.com',
    cookie: process.env.BING_COOKIE,
    'x-forwarded-for': '111.255.18.140',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50',
  },
})

const packJson = (data: unknown) => {
  return `${JSON.stringify(data)}�`
}

const conversations = {} as {
  [key: string]: BingConversation
}

const createConversation = async () => {
  const response = await axiosInstance.get('/turing/conversation/create')
  const data = response.data as BingConversation & {
    result: { value: string }
  }

  if (data.result?.value !== 'Success') {
    throw new Error(`建立聊天室失敗: ${JSON.stringify(data)}`)
  }

  return {
    invocationId: 0,
    conversationId: data.conversationId,
    clientId: data.clientId,
    conversationSignature: data.conversationSignature,
  }
}

const generate = async (conversation: BingConversation, prompt: string) => {
  const { invocationId, conversationId, clientId, conversationSignature } =
    conversation

  const text = `${prompt}${invocationId === 0 ? '\n請使用正體中文回答。' : ''}`

  const ws = new WebSocket('wss://sydney.bing.com/sydney/ChatHub', {
    perMessageDeflate: false,
  })

  let data = ''

  await new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      ws.close()
      reject(new Error('Socket: Timeout 惹'))
    }, 10 * 1000)

    ws.on('error', () => {
      if (timeout) clearTimeout(timeout)
      reject(new Error('Socket: Error 惹'))
    })

    ws.on('close', () => {
      if (timeout) clearTimeout(timeout)
    })

    ws.on('open', async () => {
      ws.send(packJson({ protocol: 'json', version: 1 }))
      ws.send(packJson({ type: 6 }))
      ws.send(
        packJson({
          arguments: [
            {
              source: 'cib',
              optionsSets: [],
              allowedMessageTypes: ['Chat'],
              sliceIds: [],
              traceId: '',
              isStartOfSession: invocationId === 0,
              message: {
                locale: 'zh-TW',
                market: 'zh-TW',
                region: 'TW',
                location: '',
                locationHints: [],
                timestamp: new Date().toISOString(),
                author: 'user',
                inputMethod: 'Keyboard',
                text,
                messageType: 'Chat',
              },
              conversationSignature,
              participant: { id: clientId },
              conversationId,
            },
          ],
          invocationId: invocationId.toString(),
          target: 'chat',
          type: 4,
        })
      )
    })

    ws.on('message', (message) => {
      try {
        let response = message.toString()
        response = response.slice(0, -1)
        const json = JSON.parse(response)

        switch (json.type) {
          case 1: {
            if (json.arguments[0].messages?.length) {
              const jsonObj = json.arguments[0].messages[0]
              const textData = jsonObj.text

              if (!textData.includes('Searching the web')) {
                if (!jsonObj.messageType) {
                  data = textData
                }

                if (timeout) clearTimeout(timeout)

                timeout = setTimeout(() => {
                  ws.close()
                  resolve('Resolved by timeout')
                }, 3 * 1000)
              }
            }
            break
          }
          case 2: {
            if (json.item?.result?.error)
              reject(new Error(json.item.result.error))
            if (json.item?.result?.value === 'InvalidSession')
              reject(new Error('Invalid session, please generate again'))

            if (!data) {
              const botMessage = json.item.messages?.find(
                (m: any) => m.author === 'bot'
              )

              if (botMessage && botMessage.hiddenText) {
                data = botMessage.hiddenText
              }
            }
            break
          }
          case 7: {
            ws.close()
            resolve('Maybe resolved')
            break
          }

          default:
        }

        if (json.error) {
          ws.close()
          reject(new Error(json.error))
        }
      } catch (e: any) {
        reject(new Error(`Socket: Message 解析錯誤: ${e.message}`))
      }
    })
  })

  // eslint-disable-next-line no-param-reassign
  conversation.invocationId += 1

  if (!data) throw new Error('機器人不想理你')

  return data
}

export default async function bing(
  message: string,
  userId?: string
): Promise<TextMessage | undefined> {
  if (!message.toLowerCase().startsWith('bing ')) {
    return undefined
  }
  if (!process.env.BING_COOKIE) {
    return createTextMessage('沒有 BING_COOKIE')
  }

  const prompt = message.slice(5).trim()
  const key = `line-${userId}`

  try {
    if (!conversations[key]) {
      conversations[key] = await createConversation()
    }
    if (prompt.toLowerCase() === 'new') {
      conversations[key] = await createConversation()
      return createTextMessage(`建立新的聊天串(${key})`)
    }
  } catch (error: any) {
    return createTextMessage(`建立新的聊天串失敗(${key}): ${error.message}`)
  }

  try {
    const conversation = conversations[key]
    const res = await generate(conversation, prompt)
    return createTextMessage([`\`${prompt.substring(0, 15)}\``, res].join('\n'))
  } catch (error: any) {
    return createTextMessage(`錯誤(bing): ${error.message}`)
  }
}
