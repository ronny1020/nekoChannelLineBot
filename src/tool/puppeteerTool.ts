import puppeteer from 'puppeteer'

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

export async function createBrowser() {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}
