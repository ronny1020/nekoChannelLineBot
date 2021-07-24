import postImage from './postImage'

test("postImage return undefined if it's not match", async () => {
  expect(await postImage('test')).toBeUndefined()
})
