import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai'

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const messages = {} as {
  [key: string]: ChatCompletionRequestMessage[]
}

export default async function gpt(
  message: string,
  userId?: string
): Promise<TextMessage | undefined> {
  if (!message.toLowerCase().startsWith('gpt ')) {
    return undefined
  }
  if (!process.env.OPENAI_API_KEY) {
    return createTextMessage('沒有 API KEY')
  }

  const prompt = message.slice(4).trim()
  const key = `line-${userId}`

  if (!messages[key]) {
    messages[key] = []
  }
  if (prompt.toLowerCase() === 'new') {
    messages[key] = []
    return createTextMessage(`建立新的聊天串(${key})`)
  }

  try {
    const messageList = messages[key]
    messageList.push({ role: 'user', content: prompt })
    const req = {
      model: 'gpt-3.5-turbo',
      messages: messageList,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }
    const completion = await openai.createChatCompletion(req)
    const completionText = completion.data.choices?.[0].message?.content || ''

    // 回復存入列表
    if (completion.data.choices?.[0].message) {
      messageList.push(completion.data.choices[0].message)
    }
    // 只留 6 個
    messageList.splice(0, messageList.length - 6)

    return createTextMessage(
      [`\`${prompt.substring(0, 15)}\``, completionText].join('\n')
    )
  } catch (error) {
    return createTextMessage('發生錯誤(gpt)')
  }
}
