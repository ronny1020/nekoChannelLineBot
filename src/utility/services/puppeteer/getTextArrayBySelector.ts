import puppeteer from 'puppeteer'

export default async function getTextArrayBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.textContent)
  )
  return text
}
