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
