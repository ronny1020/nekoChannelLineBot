import findImageUrlFromText from './findImageUrlFromText'

test('Url in Message can be found out', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const message = `blah blah blah blah blah${url} blah blah blah`

  expect(findImageUrlFromText(message)).toBe(url)
})
