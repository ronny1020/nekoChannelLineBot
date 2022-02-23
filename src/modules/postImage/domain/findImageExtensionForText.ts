const filenameExtensionList: string[] = ['.png', '.jpg', '.jpeg', '.gif']

export default function findImageExtensionForText(text: string): string {
  return (
    filenameExtensionList.find((item) => text.toLowerCase().includes(item)) ||
    ''
  )
}
