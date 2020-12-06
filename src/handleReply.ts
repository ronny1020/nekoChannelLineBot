import google from './feature/google'

export default async function handleReply(message: string): Promise<string> {
  message = message.trim()
  return google(message) || ''
}
