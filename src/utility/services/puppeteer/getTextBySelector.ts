import puppeteer from 'puppeteer'

export default async function getTextBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$eval(selector, (element) => element.textContent)
  return text
}
