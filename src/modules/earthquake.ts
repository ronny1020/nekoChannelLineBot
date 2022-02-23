import { ImageMessage } from '@line/bot-sdk'
import { createImageMessage } from '@utility/services/line/createMessage'

import { createPageToBrowser } from '@utility/services/puppeteer/puppeteerTool'

export default async function earthquake(
  message: string
): Promise<ImageMessage | undefined> {
  if (message === '最新地震') {
    const domain = 'https://www.cwb.gov.tw'
    const url = `${domain}/V8/C/E/index.html`

    const page = await createPageToBrowser()
    await page.goto(url)
    await page.waitForSelector('.eq-infor>a')

    let lastEarthquakeInfoPageUrl = await page.evaluate(() =>
      document.querySelector('.eq-infor>a')?.getAttribute('href')
    )

    lastEarthquakeInfoPageUrl = `${domain}${lastEarthquakeInfoPageUrl}`

    await page.goto(lastEarthquakeInfoPageUrl)
    await page.waitForSelector('.cube-wrap')

    let lastEarthquakeInfoImageUrl = await page.evaluate(() =>
      document.querySelector('.cube-wrap')?.getAttribute('href')
    )

    await page.close()

    lastEarthquakeInfoImageUrl = `${domain}${lastEarthquakeInfoImageUrl}`

    return createImageMessage(lastEarthquakeInfoImageUrl)
  }

  return undefined
}
