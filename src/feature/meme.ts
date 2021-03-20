/* eslint-disable no-await-in-loop */
import { TextMessage, ImageMessage, FlexMessage } from '@line/bot-sdk'
import axios from 'axios'
import imageSize from 'image-size'
import {
  createTextMessage,
  createImageMessage,
  createFlexMessage,
} from '../tool/createMessage'
import MemeModels from '../models/MemeModels'
import { Meme, OriginalMeme } from '../interface'

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

          const MemeToSave: OriginalMeme = {
            imageUrl: messageImageUrl,
            keywords: [keyword],
          }
          // check image info
          try {
            const { data, headers } = await axios.request({
              url: messageImageUrl,
              method: 'get',
            })

            if (data.includes('acTL') || extension === 'gif') {
              if (headers['content-length'] * 1 <= 300000) {
                return createTextMessage(
                  `檔案大小 ${headers['content-length']} 過大，超過限制 300000。`
                )
              }

              MemeToSave.animated = true

              const buffer = Buffer.from(data, 'binary')
              const { height, width } = imageSize(buffer)
              if (!height || !width)
                return createTextMessage(
                  `網址 ${messageImageUrl} 錯誤，無法取得圖片。`
                )
              MemeToSave.size = { height, width }
            }
          } catch {
            return createTextMessage(
              `網址 ${messageImageUrl} 錯誤，無法取得圖片。`
            )
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
    const memeList = (await getMemes()) || []
    for (let i = 0; i < memeList.length; i++) {
      const { keywords } = memeList[i]
      for (let j = 0; j < keywords.length; j++) {
        if (keywords[j] === message.slice(1)) {
          try {
            const response = await axios({
              url: memeList[i].imageUrl,
              method: 'get',
              responseType: 'arraybuffer',
            })

            const buffer = Buffer.from(response.data, 'binary')
            const size = imageSize(buffer)

            return createFlexMessage({
              type: 'bubble',
              hero: {
                type: 'image',
                url: memeList[i].imageUrl,
                size: 'full',
                aspectMode: 'fit',
                animated: response.headers['content-length'] * 1 <= 300000,
                aspectRatio: `${size.width}:${size.height}`,
                action: {
                  type: 'uri',
                  uri: memeList[i].imageUrl,
                },
              },
            })
          } catch (e) {
            return createImageMessage(memeList[i].imageUrl)
          }
        }
      }
    }
  }

  return undefined
}
