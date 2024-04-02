import { fromZodError } from 'zod-validation-error'
import type { Content } from '@google/generative-ai'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

import { final_prompt, initial_prompt } from '../utils/prompts'
import { AgentType, ChatSchema } from '@/utils/chat/schemas'
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
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const genAI = new GoogleGenerativeAI(config.gemini_api_key)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' })
  const { history } = await queryProcessedContent(event)

  const result = await readValidatedBody(event, (body) => {
    return ChatSchema.safeParse(body)
  })

  if (!result.success)
    throw fromZodError(result.error).toString()

  const body = result.data

  const messages = body.messageRepository.messages

  const train = new MessageRepository([
    ...history.getSortedRepository().map(r => r.toMessage()),
  ])

  const repository = new MessageRepository([
    ...messages.map(m => new Message(m.agent, m.message)),
  ])

  const googleTrain = train.getGoogleFormatSingle(initial_prompt(), final_prompt())

  const historyFetched = [] as Content[]
  historyFetched.push(googleTrain)

  historyFetched.push({ parts: [{ text: 'Ok.' }], role: AgentType.Ai })

  const googleHistory = repository.getGoogleFormat()

  const cuttedHistory = googleHistory.splice(0, googleHistory.length - 1)

  historyFetched.push(...cuttedHistory)

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: historyFetched,
  })

  const message = googleHistory.at(-1)?.parts.at(0)?.text

  if (!message)
    return createError('Invalid Message')

  const response = await chat.sendMessage(message)

  const responseMessage = response.response.candidates?.at(-1)?.content.parts?.at(0)?.text?.replaceAll(/\\"/g, '"')

  if (!responseMessage)
    return createError('Invalid Response')

  return { data: responseMessage }
})
