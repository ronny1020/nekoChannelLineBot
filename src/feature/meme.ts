/* eslint-disable no-await-in-loop */
import { TextMessage, ImageMessage } from '@line/bot-sdk'
import axios from 'axios'
import { createTextMessage, createImageMessage } from '../tool/createMessage'
import MemeModels from '../models/MemeModels'
import { Meme } from '../interface'

let memes: Meme[] | undefined

async function getMemes(): Promise<Meme[] | undefined> {
  if (!memes) {
    memes = await MemeModels.find({})
  }

  return memes
}

async function findAllKeywords(): Promise<string[]> {
  let allKeyWords: string[] = []

  const items = await getMemes()

  if (items)
    items.forEach((item) => {
      allKeyWords = [...allKeyWords, ...item.keywords]
    })

  return allKeyWords
}

export default async function meme(
  message: string
): Promise<TextMessage | ImageMessage | undefined> {
  if (message.startsWith('新增')) {
    const lowerCaseMessage = message.toLowerCase()
    const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png']

    if (message.includes('http')) {
      for (let i = 0; i < filenameExtensionList.length; i++) {
        const extension = filenameExtensionList[i]
        const indexOfHttp = message.indexOf('http')
        const keyword = message.substring(2, indexOfHttp).trim()

        if (keyword.includes(' '))
          return createTextMessage('請勿同時輸入複數關鍵字')

        // check if keyword has created before
        const allKeyWords = await findAllKeywords()
        if (allKeyWords.includes(keyword)) {
          return createTextMessage(`關鍵字 ${keyword} 已重複`)
        }

        if (lowerCaseMessage.includes(extension)) {
          // check if imageUrl has created before
          const messageImageUrl = message.substring(
            indexOfHttp,
            message.lastIndexOf(extension) + extension.length
          )

          try {
            await axios.request({
              url: messageImageUrl,
              method: 'get',
            })
          } catch {
            return createTextMessage(
              `網址 ${messageImageUrl} 錯誤，無法取得圖片。`
            )
          }

          const memeList = (await getMemes()) || []
          for (let j = 0; j < memeList.length; j++) {
            const { imageUrl, id } = memeList[j]
            if (imageUrl === messageImageUrl) {
              const result = await MemeModels.findByIdAndUpdate(id, {
                $push: { keywords: keyword },
              })
              if (result) {
                memes = await MemeModels.find({})
                return createTextMessage(
                  `已增加關鍵字 ${keyword} 至 ${imageUrl}`
                )
              }
              return createTextMessage(`新增失敗`)
            }
          }

          // add keyboard
          const memeModel = new MemeModels({
            imageUrl: messageImageUrl,
            keywords: [keyword],
          })
          const result = await memeModel.save()
          if (result) {
            memes = await MemeModels.find({})
            return createTextMessage(
              `已增加新 MEME ${keyword}:${messageImageUrl}`
            )
          }
          return createTextMessage(`新增失敗`)
        }
      }
    }
  }

  // get meme
  if (message.startsWith('#')) {
    const memeList = (await getMemes()) || []
    for (let i = 0; i < memeList.length; i++) {
      const { keywords } = memeList[i]
      for (let j = 0; j < keywords.length; j++) {
        if (keywords[j] === message.slice(1)) {
          return createImageMessage(memeList[i].imageUrl)
        }
      }
    }
  }

  return undefined
}
