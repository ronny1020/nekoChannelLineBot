import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'
import axios, { AxiosResponse } from 'axios'

export default async function translate(
  message: string
): Promise<TextMessage | undefined> {
  if (message.startsWith('翻譯')) {
    let lang
    let langCode: string
    let textToTranslateStartFrom = 5

    if (message.charAt(2) === '成') {
      lang = message.substr(3, 2)
    }

    switch (lang) {
      case '英文':
      case '英語':
      case '美語':
        langCode = 'en'
        break
      case '繁中':
      case '中文':
      case '國語':
      case '國文':
        langCode = 'zh-TW'
        break
      case '日語':
      case '日文':
        langCode = 'ja'
        break
      default:
        langCode = 'zh-TW'
        textToTranslateStartFrom = 2
    }

    const textToTranslate = message.substr(textToTranslateStartFrom)

    return createTextMessage(
      (
        await Promise.all(
          textToTranslate.split(/\r?\n/).map(
            (paragraph): Promise<AxiosResponse | undefined> =>
              paragraph.trim()
                ? axios.get(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURI(
                      paragraph
                    )}`
                  )
                : new Promise((resolve) => {
                    resolve(undefined)
                  })
          )
        )
      )
        .map((res): string => (res ? res.data[0][0][0] : ''))
        .join('\n')
    )
  }

  return undefined
}
