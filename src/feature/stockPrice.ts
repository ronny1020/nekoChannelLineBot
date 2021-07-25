import { FlexMessage, TextMessage } from '@line/bot-sdk'
import { createBubbleFlexTextMessage } from '../tool/createFlexTextMessage'
import { createTextMessage } from '../tool/createMessage'
import { createPageToBrowser, getTextBySelector } from '../tool/puppeteerTool'

export default async function stockPrice(
  message: string
): Promise<FlexMessage | TextMessage | undefined> {
  if (message.endsWith('股價')) {
    const url = `https://www.google.com.tw/search?q=${encodeURI(message)}`

    const page = await createPageToBrowser()

    try {
      page.setDefaultTimeout(10000)
      await page.goto(url)
      // await page.screenshot({ path: `screenshots.jpeg` })

      await page.waitForSelector('#search')

      let stockName = await getTextBySelector(page, '.oPhL2e')

      const textToRemove = 'Market Summary'
      stockName =
        stockName?.replace(textToRemove, '').replace('>', '').trim() || ' '

      const [
        stockCode,
        stockCurrentPrice,
        stockCurrency,
        stockRate,
        updatedTime,
        [
          stockOpen,
          stockHight,
          stockLow,
          stockMktCap,
          stockPERatio,
          stockDivYield,
          PrevClose,
          stock52wkHight,
          stock52wkLow,
        ],
      ] = await Promise.all([
        getTextBySelector(page, '.HfMth'),
        getTextBySelector(page, '.IsqQVc'),
        getTextBySelector(page, '.knFDje'),
        getTextBySelector(page, '.WlRRw'),
        getTextBySelector(page, '.TgMHGc > span:nth-child(2)'),
        page.$$eval('.iyjjgb', (elements) =>
          elements.map((element) => element.textContent)
        ),
      ])

      page.close()

      let stockColor
      if (stockRate?.startsWith('+')) stockColor = '#dc3545'
      else if (stockRate?.startsWith('-')) stockColor = '#28a745'

      return createBubbleFlexTextMessage(
        {
          title: stockName,

          contents: [
            {
              key: `${stockCurrentPrice} ${stockCurrency}`,
              keyColor: stockColor,
              keySize: 'md',
              value: stockRate || ' ',
              valueColor: stockColor,
              valueSize: 'md',
            },
            {
              key: '更新時間',
              value: updatedTime || ' ',
            },
            'separator',
            {
              key: '開盤',
              value: stockOpen || ' ',
            },
            {
              key: '最高',
              value: stockHight || ' ',
            },
            {
              key: '最低',
              value: stockLow || ' ',
            },
            {
              key: '市值',
              value: stockMktCap || ' ',
            },
            {
              key: '本益比',
              value: stockPERatio || ' ',
            },
            {
              key: '殖利率',
              value: stockDivYield || ' ',
            },
            {
              key: '昨收',
              value: PrevClose || ' ',
            },
            {
              key: '52週最高',
              value: stock52wkHight || ' ',
            },
            {
              key: '52週最低',
              value: stock52wkLow || ' ',
            },
            'separator',
            {
              key: '代號',
              value: stockCode || ' ',
            },
          ],
        },
        `${stockName}股價`
      )
    } catch (error) {
      console.error(error)

      page.close()
      return createTextMessage(`無${message.replace(' ', '')}資訊`)
    }
  }

  return undefined
}
