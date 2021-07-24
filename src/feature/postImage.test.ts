import { ImageMessage } from '@line/bot-sdk'
import postImage, {
  findImageExtensionForText,
  findImageUrlFromText,
} from './postImage'

test("postImage return undefined if it's not match", async () => {
  expect(await postImage('test')).toBeUndefined()
})

test('Url from returned message should be the same as the original url.', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const { originalContentUrl } = (await postImage(url)) as ImageMessage

  expect(originalContentUrl).toBe(url)
})

test('Extension in Message can be found out', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const message = `blah blah blah blah blah${url} blah blah blah`

  expect(findImageExtensionForText(message)).toBe('.jpg')
})

test('Url in Message can be found out', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const message = `blah blah blah blah blah${url} blah blah blah`

  expect(findImageUrlFromText(message)).toBe(url)
})
