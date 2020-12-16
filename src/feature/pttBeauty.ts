import axios from 'axios'

import { TextMessage } from '@line/bot-sdk'

import { createTextMessage } from '../tool/createMessage'

async function getPageDataFromPttUrl(url: string): Promise<string | null> {
  try {
    const { data } = await axios.request({
      url: url,
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

  const imageLinkRegexp = /(http)?s?:?(\/\/[^"'\n]*\.(?:png|jpg|jpeg))/g

  const imagesUrlList = data.match(imageLinkRegexp)

  if (!imagesUrlList) return []

  return imagesUrlList.filter(
    (link, index) => imagesUrlList.indexOf(link) === index
  )
}

async function getArticleUrlList(pageNumber: number): Promise<string[]> {
  const randomPageData = await getPageDataFromPttUrl(
    `https://www.ptt.cc/bbs/Beauty/index${pageNumber}.html`
  )
  if (!randomPageData) return []

  let list = randomPageData.match(
    /(\/bbs\/Beauty\/)(M\.)([0-9]*)(\.A\.)([A-Z0-9]*)(\.html">\[正妹\])/g
  )

  if (!list) return []

  list = list.map((item) => item.substr(12, 18))
  return list
}

export default async function pttBeauty(
  message: string
): Promise<TextMessage | undefined> {
  if (message === 'b') {
    const pttBeautyRootUrl = 'https://www.ptt.cc/bbs/Beauty/index.html'

    const rootPageData = await getPageDataFromPttUrl(pttBeautyRootUrl)

    if (!rootPageData) return createTextMessage('ptt 連線錯誤')

    const previousPageUrl = rootPageData.match(
      /(\/bbs\/Beauty\/index)([0-9]{4})(\.html)/g
    )
    if (!previousPageUrl) return createTextMessage('ptt 連線錯誤')

    const pageNumber = Number(previousPageUrl[0].substr(17, 4))
    const randomPageNumber = pageNumber + 1 - Math.round(Math.random() * 500)

    let articleUrlList = await getArticleUrlList(randomPageNumber)

    let imageList: string[] = []
    let index
    let maxRetryTimes = 10

    while (!imageList.length && articleUrlList.length && maxRetryTimes) {
      index = Math.floor(Math.random() * articleUrlList.length)

      imageList = await getImageUrlList(
        `https://www.ptt.cc/bbs/Beauty/${articleUrlList[index]}.html`
      )

      if (!imageList.length) {
        articleUrlList.splice(index, 0)
      }
      if (!articleUrlList.length) {
        articleUrlList = await getArticleUrlList(randomPageNumber)
      }
      maxRetryTimes--
    }

    if (maxRetryTimes === 0) return createTextMessage('達最高重試次數')
    console.log(imageList)

    return createTextMessage('b')
  }
  return
}
