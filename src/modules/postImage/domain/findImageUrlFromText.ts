export default function findImageUrlFromText(text: string): string {
  const regex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/g
  const match = text.match(regex)

  return match ? match[0] : ''
}
