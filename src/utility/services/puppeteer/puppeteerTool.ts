import puppeteer, { Browser, Page } from 'puppeteer'

let puppeteerBrowser: Browser

export async function openBrowser() {
  puppeteerBrowser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('Puppeteer browser is open')
}

export function createPageToBrowser(): Promise<Page> {
  if (puppeteerBrowser) return puppeteerBrowser.newPage()

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createPageToBrowser())
    }, 1000)
  })
}
