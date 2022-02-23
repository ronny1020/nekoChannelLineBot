import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'

import getLinkArrayBySelector from '@utility/services/puppeteer/getLinkArrayBySelector'
import getTextArrayBySelector from '@utility/services/puppeteer/getTextArrayBySelector'
import { createPageToBrowser } from '@utility/services/puppeteer/puppeteerTool'

export default async function youtube(
  message: string
): Promise<TextMessage | undefined> {
  const reg = /^((youtube search))/i
  if (!reg.test(message.toLowerCase())) {
    return undefined
  }

  const keyword = message.replace(reg, '').trim()

  const url = `https://www.youtube.com/results?search_query=${encodeURI(
    keyword
  )}`

  const page = await createPageToBrowser()
  try {
    page.setDefaultTimeout(10000)
    await page.goto(url)

    await page.waitForSelector('#search')

    // await page.screenshot({ path: `screenshots.jpeg` })

    const titles = await getTextArrayBySelector(page, '#video-title')
    const links = await getLinkArrayBySelector(page, '#video-title')

    page.close()

    return createTextMessage(
      titles
        .map((title, index) => ({ title, link: links[index] }))
        .filter(({ title, link }) => title && link)
        .filter((_, index) => index < 3)
        .map(
          ({ title, link }) =>
            `${title?.trim()}\nhttps://www.youtube.com/${link}\n`
        )
        .join('\n')
    )
  } catch (error) {
    console.error(error)

    page.close()
    return createTextMessage(`無${keyword}資訊`)
  }
}
