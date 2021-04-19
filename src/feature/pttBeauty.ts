import axios from 'axios'

import {
  FlexBubble,
  FlexCarousel,
  FlexMessage,
  TextMessage,
} from '@line/bot-sdk'

import { createFlexMessage, createTextMessage } from '../tool/createMessage'

async function getPageDataFromPttUrl(url: string): Promise<string | null> {
  try {
    const { data } = await axios.request({
      url,
      method: 'get',
      headers: {
        Cookie: 'over18=1',
      },
    })
    return data
  } catch {
    return null
  }
}

async function getImageUrlList(url: string): Promise<string[]> {
  const data = await getPageDataFromPttUrl(url)

  if (!data) return []

  const imageLinkRegexp = /(https:\/\/)([^"'\n]*\.(?:png|jpg|jpeg))/g

  const imagesUrlList = data.match(imageLinkRegexp)

  if (!imagesUrlList) return []

  return imagesUrlList.filter(
    (link, index, self) => self.indexOf(link) === index
  )
}

async function getArticleUrlList(pageNumber: number): Promise<string[]> {
  const randomPageData = await getPageDataFromPttUrl(
    `https://www.ptt.cc/bbs/Beauty/search?page=${pageNumber}&q=recommend%3A50`
  )
  if (!randomPageData) return []

  let list = randomPageData.match(
    /(\/bbs\/Beauty\/)(M\.)([0-9]*)(\.A\.)([A-Z0-9]*)(\.html">\[正妹\])/g
  )

  if (!list) return []

  list = list.map((item) => item.substr(12, 18))
  return list
}

// main
export default async function pttBeauty(
  message: string
): Promise<FlexMessage | TextMessage | undefined> {
  if (message === 'ptt表特' || message === 'ptt beauty') {
    let pageNumber = 1 + Math.round(Math.random() * 100)

    let articleUrlList = await getArticleUrlList(pageNumber)

    let imageList: string[] = []
    let index = Math.floor(Math.random() * articleUrlList.length)
    let maxRetryTimes = 10

    while (!imageList.length && articleUrlList.length && maxRetryTimes) {
      // eslint-disable-next-line no-await-in-loop
      imageList = await getImageUrlList(
        `https://www.ptt.cc/bbs/Beauty/${articleUrlList[index]}.html`
      )

      if (!imageList.length) {
        articleUrlList.splice(index, 0)
        index = Math.floor(Math.random() * articleUrlList.length)
      }
      if (!articleUrlList.length) {
        pageNumber += 1
        // eslint-disable-next-line no-await-in-loop
        articleUrlList = await getArticleUrlList(pageNumber)
      }
      maxRetryTimes -= 1
    }

    if (maxRetryTimes === 0) return createTextMessage('達最高重試次數')

    if (imageList.length > 12) imageList.length = 12

    const contents: FlexBubble[] = imageList.map((url) => ({
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            url,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '9:16',
            gravity: 'top',
          },
        ],
        paddingAll: '0px',
      },
      action: {
        type: 'uri',
        label: 'action',
        uri: `https://www.ptt.cc/bbs/Beauty/${articleUrlList[index]}.html`,
      },
    }))

    const flexContainer: FlexCarousel = { type: 'carousel', contents }

    const flexMessage: FlexMessage = createFlexMessage(flexContainer, 'PTT表特')

    return flexMessage
  }
  return undefined
}
