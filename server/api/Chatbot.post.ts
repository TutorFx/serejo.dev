import { fromZodError } from 'zod-validation-error'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

import { ChatSchema } from '@/utils/chat/schemas'
import MessageRepository from '@/utils/chat/MessageRepository'
import Message from '@/utils/chat/entities/Message'

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const genAI = new GoogleGenerativeAI(config.gemini_api_key)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' })

  const result = await readValidatedBody(event, (body) => {
    return ChatSchema.safeParse(body)
  })

  if (!result.success)
    throw fromZodError(result.error).toString()

  const body = result.data

  const messages = body.messageRepository.messages

  const repository = new MessageRepository([
    ...messages.map(m => new Message(m.agent, m.message)),
  ])

  const googleHistory = repository.getGoogleHistory()

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: googleHistory.splice(0, -2),
  })

  const message = googleHistory.at(-1)?.parts.at(0)?.text

  if (!message)
    return createError('Invalid Message')

  const response = await chat.sendMessage(message)

  const responseMessage = response.response.candidates?.at(-1)?.content.parts?.at(0)?.text

  if (!responseMessage)
    return createError('Invalid Response')

  return { data: responseMessage }
})
