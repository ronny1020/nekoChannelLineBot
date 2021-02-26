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
    const url = `https://www.google.com.tw/search?q=${encodeURI(message)}`

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    try {
      page.setDefaultTimeout(10000)
      await page.goto(url)
      // await page.screenshot({ path: `screenshots.jpeg` })

      await page.waitForSelector('#search')

      let stockName = await getTextBySelector(page, '.oPhL2e')

      const textToRemove = 'Market Summary > '
      if (stockName?.startsWith(textToRemove))
        stockName = stockName.slice(textToRemove.length)

      const stockCode = await getTextBySelector(page, '.HfMth')
      const stockCurrentPrice = await getTextBySelector(page, '.IsqQVc')
      const stockCurrency = await getTextBySelector(page, '.knFDje')
      const stockRate = await getTextBySelector(page, '.WlRRw')
      const updatedTime = await getTextBySelector(
        page,
        '.TgMHGc > span:nth-child(2)'
      )

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

${stockCurrentPrice} ${stockCurrency} | ${stockRate}
${updatedTime}

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
    } catch (error) {
      browser.close()
      console.error(error)
      return createTextMessage(`無${message.replace(' ', '')}資訊`)
    }
  }

  return undefined
}
