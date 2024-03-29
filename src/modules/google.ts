import { TextMessage } from '@line/bot-sdk'
import { createTextMessage } from '@utility/services/line/createMessage'
import getLinkArrayBySelector from '@utility/services/puppeteer/getLinkArrayBySelector'
import getTextArrayBySelector from '@utility/services/puppeteer/getTextArrayBySelector'
import { createPageToBrowser } from '@utility/services/puppeteer/puppeteerTool'

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
    await page.goto(url)

    await page.waitForSelector('#search')

    // await page.screenshot({ path: `screenshots.jpeg` })

    const [titles, links, descriptions] = await Promise.all([
      getTextArrayBySelector(page, 'h3.LC20lb.DKV0Md'),
      getLinkArrayBySelector(page, '.yuRUbf>a'),
      getTextArrayBySelector(page, '.VwiC3b'),
    ])

    titles.length = 3

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
