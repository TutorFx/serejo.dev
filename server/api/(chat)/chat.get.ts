import { H3Error } from 'h3'

export default defineEventHandler<Promise<MessageType[] | H3Error>>( async (event) => {
  const prisma = usePrisma()
  const guest = await setupGuest(event, { chat: true })

  if (!guest?.chat?.id) return []

  const messages = await asyncEnvelope(async () => await prisma.message.findMany({ where: { chatId: guest?.chat?.id || 'invalid' }}))

  if (!messages.data) return []

  return messages.data.map(message => dbToMessage(message))
})