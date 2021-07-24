import puppeteer, { Browser } from 'puppeteer'

let puppeteerBrowser: Browser

export async function openBrowser() {
  puppeteerBrowser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('Puppeteer browser is open')
}

export async function createPageToBrowser() {
  return puppeteerBrowser.newPage()
}

export async function getTextBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$eval(selector, (element) => element.textContent)
  return text
}

export async function getTextArrayBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.textContent)
  )
  return text
}

export async function getLinkArrayBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.getAttribute('href'))
  )
  return text
}
