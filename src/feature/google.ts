export default async function google(message: string): Promise<string> {
  if (message.substr(0, 6).toLowerCase() === 'google') {
    'https://www.google.com/search?q=' + message.substr(7).replace(' ', '+')
  }

  return ''
}
