export default async function postImage(message: string): Promise<string> {
  const lowerCaseMessage = message.toLowerCase()
  const filenameExtensionList: string[] = ['jpg', 'jpeg', 'png']

  if (message.includes('http')) {
    for (const extension of filenameExtensionList) {
      if (lowerCaseMessage.includes(extension)) {
        return message.substring(
          message.indexOf('http'),
          message.lastIndexOf(extension) + extension.length
        )
      }
    }
  }

  return ''
}
