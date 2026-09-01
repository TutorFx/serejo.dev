import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, streamText, stepCountIs } from 'ai'
import z from 'zod/v4'
import { and, eq } from 'drizzle-orm'
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  const chatReqStart = performance.now()
  const config = useRuntimeConfig()
  const session = await getUserSession(event)

  const { apiKey } = geminiEnvSchema.parse({
    apiKey: config.gemini.apiKey,
  })

  const llm = createGoogleGenerativeAI({
    apiKey,
  })

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const logger = consola.withTag(`chat:${id.slice(0, 8)}`)

  const { messages, timeZone } = await readValidatedBody(event, z.object({
    messages: z.array(z.custom<UIMessage>()),
    timeZone: z.enum(Intl.supportedValuesOf('timeZone')),
  }).parse)

  const sessionTimeZone = new TZDate(new Date(), timeZone)

  const db = useDrizzle()

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id),
      eq(schema.chats.userId, session.user?.id || session.id)
    ),
    with: {
      messages: true
    }
  })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (!chat.title) {
    const titleStart = performance.now()
    const { text: title } = await generateText({
      model: llm('gemini-2.5-flash-lite'),
      system: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
      prompt: JSON.stringify(messages[0])
    })

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id))
    const titleDuration = (performance.now() - titleStart).toFixed(2)
    logger.info(`Generated chat title "${title}" in ${titleDuration}ms`)
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      id: lastMessage.id,
      chatId: id,
      role: 'user',
      parts: lastMessage.parts
    }).onConflictDoUpdate({ target: schema.messages.id, set: { parts: lastMessage.parts } })
  }

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const resumeStart = performance.now()
  const resumeContext = await getResumeContext(event)
  const resumeDuration = (performance.now() - resumeStart).toFixed(2)
  logger.info(`Loaded dynamic resumeContext in ${resumeDuration}ms`)

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const streamStart = performance.now()
      const currentDateFormatted = `${format(sessionTimeZone, 'EEEE, yyyy-MM-dd HH:mm:ss', { locale: enUS })} (${format(sessionTimeZone, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })})`

      const result = streamText({
        model: llm('gemini-2.5-flash'),
        system: `
You are the virtual assistant for Gabriel Serejo's portfolio (AI Specialist & Engineer).
Mission: Help visitors learn about Gabriel's projects, career trajectory, and ideas, discuss technology/AI, and facilitate scheduling meetings. Always respond in the visitor's language.

Reference Time: ${currentDateFormatted} | TimeZone: ${timeZone}

${resumeContext}

**Core Rules:**
- **No Greeting Loops**: When a conversation is already in progress, respond directly to the user's latest query without repeating greetings.
- **Factual Fidelity**: Rely strictly on data returned by tools. Never guess technical acronyms or invent facts. If information is not in the search results, state that the portfolio does not cover that specific detail.
- **Conciseness**: Keep responses clear, objective, and formatted with Markdown.

**Search & Knowledge Retrieval:**
- Always call 'searchContent' first when asked about projects, blog articles, career background, or technical concepts.
- Use 'adjacentContent' to expand surrounding document context when needed.

**Scheduling & Calendar Flow:**
1. **Resolve Date & Check Availability (Immediate)**:
   - For relative dates (e.g., "in 3 days"), call 'calculateDate'.
   - For weekdays (e.g., "on Friday", "next Monday"), call 'getWeekday'.
   - **MANDATORY**: In the same step, IMMEDIATELY call 'calendar' with the resolved date ('yyyy-MM-dd'). Never ask the user for a preferred time before checking availability on that date.
2. **Present Slots**: Summarize availability concisely (e.g., "Gabriel has available slots in the afternoon. Which time works best?"). The UI renders interactive slot cards automatically.
3. **Collect Details**: Once a time is chosen, ask in ONE message for: **Name**, **Email**, and **Meeting Purpose**.
4. **Book ('createMeeting')**:
   - Default duration: 1 hour (auto-calculate 'startTime' and 'endTime' in ISO).
   - 'attendees': ONLY the visitor's email address.
   - 'summary': "Meeting: [Topic/Company] - [Visitor Name]".
   - Clarify that this is a **Meeting Request** pending Gabriel's confirmation via email.
`.trim(),
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({
          delayInMs: 20,
          chunking: 'word',
        }),
        tools: {
          [CHAT_TOOL.calculateDate]: calculateDateTool({ timeZone }),
          [CHAT_TOOL.getWeekday]: getWeekdayTool({ timeZone }),
          [CHAT_TOOL.calendar]: calendarTool({ chatId: id, timeZone }),
          [CHAT_TOOL.createMeeting]: createMeetingTool({ chatId: id, timeZone }),
          [CHAT_TOOL.searchContent]: hybridSearchTool({ chatId: id }),
          [CHAT_TOOL.adjacentContent]: adjacentSearchTool({ chatId: id }),
        },
        stopWhen: stepCountIs(5),
        toolChoice: 'auto',
        temperature: 0.2
      })

      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Generating title...' },
          transient: true
        })
      }

      const uiStream = result.toUIMessageStream({
        sendReasoning: true,
        sendStart: false,
      })

      let firstChunkTime: number | null = null
      for await (const chunk of uiStream) {
        if (firstChunkTime === null) {
          firstChunkTime = performance.now()
          logger.info(`Time-to-First-Chunk (TTFC): ${(firstChunkTime - streamStart).toFixed(2)}ms (from request start: ${(firstChunkTime - chatReqStart).toFixed(2)}ms)`)
        }
        writer.write(chunk)
      }
      const streamTotalDuration = (performance.now() - streamStart).toFixed(2)
      logger.success(`Chat streaming completed in ${streamTotalDuration}ms`)
    },
    onFinish: async ({ messages }) => {
      await db.insert(schema.messages).values(messages.map(message => ({
        id: message.id,
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      }))).onConflictDoNothing()
    },
  })

  return createUIMessageStreamResponse({
    stream,
  })
})
