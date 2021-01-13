import { TextMessage } from '@line/bot-sdk'
import puppeteer from 'puppeteer'
import { createTextMessage } from '../tool/createMessage'

async function getTextBySelector(page: puppeteer.Page, selector: string) {
  const text = await page.$eval(selector, (element) => element.textContent)
  return text
}

export default async function stockPrice(
  message: string
): Promise<TextMessage | undefined> {
  if (message.endsWith('股價')) {
    const url = `https://www.google.com/search?q=${encodeURI(message)}&tbm=fin`

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.mfMhoc')

    const stockName = await getTextBySelector(page, '.mfMhoc')
    const stockCode = await getTextBySelector(page, '.wx62f')
    const stockCurrentPrice = await getTextBySelector(page, '.IsqQVc')
    const stockCurrency = await getTextBySelector(page, '.knFDje')
    const stockRate = await getTextBySelector(page, '.WlRRw')

    const [
      stockOpen,
      stockHight,
      stockLow,
      stockMktCap,
      stockPERatio,
      stockDivYield,
      PrevClose,
      stock52wkHight,
      stock52wkLow,
    ] = await page.$$eval('.iyjjgb', (elements) =>
      elements.map((element) => element.textContent)
    )

    const MessageText = `${stockName}
${stockCode}

${stockCurrentPrice} ${stockCurrency} |wk4 ${stockRate}

開盤：${stockOpen}
最高：${stockHight}
最低：${stockLow}
市值：${stockMktCap}
本益比：${stockPERatio}
殖利率：${stockDivYield}
昨收：${PrevClose}
52週最高：${stock52wkHight}
52週最低：${stock52wkLow}`

    return createTextMessage(MessageText)

    await browser.close()
  }

  return undefined
}
