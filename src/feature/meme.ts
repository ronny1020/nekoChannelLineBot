import { TextMessage, ImageMessage } from '@line/bot-sdk'
import { createTextMessage, createImageMessage } from '../tool/createMessage'
import { MemeModels } from '../models/MemeModels'
import { Meme } from '../interface'

let memes: Meme[] | undefined

async function getMemes(): Promise<Meme[]> {
  if (!memes) {
    memes = await MemeModels.find({})
  }

  return memes
}

async function findAllKeywords(): Promise<string[]> {
  let allKeyWords: string[] = []

  for (const meme of await getMemes()) {
    allKeyWords = [...allKeyWords, ...meme.keywords]
  }

  return allKeyWords
}

export default async function meme(
  message: string
): Promise<TextMessage | ImageMessage | undefined> {
  if (message.startsWith('新增')) {
    const lowerCaseMessage = message.toLowerCase()
    const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png']

    if (message.includes('http')) {
      for (const extension of filenameExtensionList) {
        const indexOfHttp = message.indexOf('http')
        const keyword = message.substring(2, indexOfHttp).trim()

        const prohibitWords = [
          'google',
          'wiki',
          'weather',
          '天氣',
          '台北',
          '翻譯',
        ]
        if (prohibitWords.includes(keyword.toLocaleLowerCase()))
          return createTextMessage('關鍵字含有保留字')

        if (keyword.includes(' '))
          return createTextMessage('請勿同時輸入複數關鍵字')

        // check if keyword has created before
        const allKeyWords = await findAllKeywords()
        if (allKeyWords.includes(keyword)) {
          return createTextMessage(`關鍵字 ${keyword} 已重複`)
        }

        if (lowerCaseMessage.includes(extension)) {
          // check if imageUrl has created before
          const imageUrl = message.substring(
            indexOfHttp,
            message.lastIndexOf(extension) + extension.length
          )
          console.log(imageUrl)

          for (const meme of await getMemes()) {
            console.log(meme.imageUrl)
            if (meme.imageUrl === imageUrl) {
              const result = await MemeModels.findByIdAndUpdate(meme._id, {
                $push: { keywords: keyword },
              })
              if (result) {
                memes = await MemeModels.find({})
                return createTextMessage(
                  `已增加關鍵字 ${keyword} 至 ${imageUrl}`
                )
              } else {
                return createTextMessage(`新增失敗`)
              }
            }
          }

          //add keyboard
          const meme = new MemeModels({ imageUrl, keywords: [keyword] })
          const result = await meme.save()
          if (result) {
            memes = await MemeModels.find({})
            return createTextMessage(`已增加新 MEME ${keyword}:${imageUrl}`)
          } else {
            return createTextMessage(`新增失敗`)
          }
        }
      }
    }
  }

  //get meme
  for (const meme of await getMemes()) {
    for (const keyword of meme.keywords) {
      if (keyword === message) {
        return createImageMessage(meme.imageUrl)
      }
    }
  }

  return
}
