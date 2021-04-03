import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '../tool/createMessage'
import {
  createBrowser,
  getTextArrayBySelector,
  getLinkArrayBySelector,
} from '../tool/puppeteerTool'

export default async function google(
  message: string
): Promise<TextMessage | undefined> {
  if (message.startsWith('google search')) {
    const url = `https://www.google.com.tw/search?q=${encodeURI(
      message.replace('google search', '').trim()
    )}`

    const browser = await createBrowser()
    const page = await browser.newPage()
    try {
      page.setDefaultTimeout(10000)
      await page.goto(url)

      await page.waitForSelector('#search')

      // await page.screenshot({ path: `screenshots.jpeg` })

      const titles = await getTextArrayBySelector(page, 'h3.LC20lb.DKV0Md')
      const links = await getLinkArrayBySelector(page, '.yuRUbf>a')
      const descriptions = await getTextArrayBySelector(
        page,
        'span.aCOpRe>span'
      )

      browser.close()
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

      browser.close()
      return createTextMessage(
        `無${message.replace('google search', '').trim()}資訊`
      )
    }
  }
  return undefined
}
