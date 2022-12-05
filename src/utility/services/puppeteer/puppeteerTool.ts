import puppeteer, { Browser, Page } from 'puppeteer'

async function openPuppeteerBrowser() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('Puppeteer browser is open.')

  return browser
}

let puppeteerBrowserPromise: Promise<Browser>

export function getPuppeteerBrowser() {
  if (puppeteerBrowserPromise) return puppeteerBrowserPromise

  puppeteerBrowserPromise = openPuppeteerBrowser()

  return puppeteerBrowserPromise
}

export async function createPageToBrowser(): Promise<Page> {
  const puppeteerBrowser = await getPuppeteerBrowser()

  return puppeteerBrowser.newPage()
}
