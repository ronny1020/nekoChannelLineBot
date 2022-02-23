import puppeteer from 'puppeteer'

export default async function getLinkArrayBySelector(
  page: puppeteer.Page,
  selector: string
) {
  const text = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.getAttribute('href'))
  )
  return text
}
