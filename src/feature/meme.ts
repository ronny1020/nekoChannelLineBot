/* eslint-disable no-await-in-loop */
import { TextMessage, ImageMessage, FlexMessage } from '@line/bot-sdk'
import { createTextMessage, createFlexMessage } from '../tool/createMessage'
import MemeModels from '../models/MemeModels'
import { Meme, OriginalMeme } from '../interface'
import createAnimatedImageMessage from '../tool/createAnimatedImageMessage'
import checkImageType from '../tool/checkImageType'

let memes: Meme[]
const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png', 'gif']

async function getMemes(): Promise<Meme[]> {
  if (!memes) {
    memes = await MemeModels.find({})
  }

  return memes
}

async function findAllKeywords(): Promise<string[]> {
  const items = await getMemes()
  return items.reduce((prev: string[], item) => [...prev, ...item.keywords], [])
}

export default async function meme(
  message: string
): Promise<TextMessage | ImageMessage | FlexMessage | undefined> {
  if (message.startsWith('新增')) {
    const lowerCaseMessage = message.toLowerCase()

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

          // add keyword
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

          // check image info
          const imageType = await checkImageType(messageImageUrl, extension)
          if (typeof imageType === 'string') return createTextMessage(imageType)

          const MemeToSave: OriginalMeme = {
            imageUrl: messageImageUrl,
            keywords: [keyword],
            ...imageType,
          }

          const memeModel = new MemeModels(MemeToSave)
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

  // list meme
  if (message.startsWith('#list')) {
    const searchKeyword = message.substr(5).trim()
    const keywords = await findAllKeywords()

    return createFlexMessage(
      {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: keywords
            .filter((keyword) => keyword.includes(searchKeyword))
            .map((keyword) => ({
              type: 'button',
              action: {
                type: 'message',
                label: keyword,
                text: `#${keyword}`,
              },
              margin: 'xs',
              height: 'sm',
              style: 'secondary',
            })),
        },
      },
      'Meme List'
    )
  }

  // get meme
  if (message.startsWith('#')) {
    const inputtedKeyword = message.slice(1)
    const memeList = (await getMemes()) || []
    const foundMemes = memeList.find(({ keywords }) =>
      keywords.includes(inputtedKeyword)
    )

    if (!foundMemes)
      return createTextMessage(`找不到關鍵字：${inputtedKeyword}`)

    const { imageUrl, animated, size } = foundMemes
    return createAnimatedImageMessage(imageUrl, animated, size)
  }

  return undefined
}
