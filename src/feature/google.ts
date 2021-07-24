import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '../tool/createMessage'
import {
  getTextArrayBySelector,
  getLinkArrayBySelector,
  createPageToBrowser,
} from '../tool/puppeteerTool'

export default async function google(
  message: string
): Promise<TextMessage | undefined> {
  const reg = /^((google search)|(!google))/gi
  if (!reg.test(message.toLowerCase())) {
    return undefined
  }

  const keyword = message.replace(reg, '').trim()

  const url = `https://www.google.com.tw/search?q=${encodeURI(keyword)}`

  const page = await createPageToBrowser()
  try {
    page.setDefaultTimeout(10000)
    await page.goto(url)

    await page.waitForSelector('#search')

    // await page.screenshot({ path: `screenshots.jpeg` })

    const titles = await getTextArrayBySelector(page, 'h3.LC20lb.DKV0Md')
    const links = await getLinkArrayBySelector(page, '.yuRUbf>a')
    const descriptions = await getTextArrayBySelector(page, 'span.aCOpRe>span')

    page.close()
    return createTextMessage(
      titles
        .map(
          (title, index) =>
            `${title}\n${links[index]}\n${descriptions[index]}\n`
        )
        .join('\n')
    )
  } catch (error) {
    console.error(error)

    page.close()
    return createTextMessage(`無${keyword}資訊`)
  }
}
