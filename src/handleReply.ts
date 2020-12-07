import google from './feature/google'
import weather from './feature/weather'

export default async function handleReply(message: string): Promise<string> {
  message = message.trim()
  return (await google(message)) || (await weather(message)) || ''
}
