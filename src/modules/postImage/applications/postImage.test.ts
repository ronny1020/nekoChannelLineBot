import { ImageMessage } from '@line/bot-sdk'
import postImage from './postImage'

test("postImage return undefined if it's not match", async () => {
  expect(await postImage('test')).toBeUndefined()
})

test('Url from returned message should be the same as the original url.', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const { originalContentUrl } = (await postImage(url)) as ImageMessage

  expect(originalContentUrl).toBe(url)
})
