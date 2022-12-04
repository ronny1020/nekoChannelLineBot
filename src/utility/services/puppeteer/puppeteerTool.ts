import puppeteer, { Browser, Page } from 'puppeteer'

let puppeteerBrowserPromise: Promise<Browser>

export function getPuppeteerBrowser() {
  if (puppeteerBrowserPromise) return puppeteerBrowserPromise

  puppeteerBrowserPromise = new Promise((resolve) => {
    resolve(
      puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    )
    console.log('Puppeteer browser is open')
  })

  return puppeteerBrowserPromise
}

export async function createPageToBrowser(): Promise<Page> {
  const puppeteerBrowser = await getPuppeteerBrowser()

  return puppeteerBrowser.newPage()
}
