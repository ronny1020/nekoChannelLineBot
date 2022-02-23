import findImageExtensionForText from './findImageExtensionForText'

test('Extension in Message can be found out', async () => {
  const url = 'https://i.imgur.com/bXjNTVw.jpg'
  const message = `blah blah blah blah blah${url} blah blah blah`

  expect(findImageExtensionForText(message)).toBe('.jpg')
})
