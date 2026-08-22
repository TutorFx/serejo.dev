import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, streamText, stepCountIs } from 'ai'
import z from 'zod/v4'
import { and, eq } from 'drizzle-orm'
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { consola } from 'consola'
import { tables } from '#content/manifest'

export default defineEventHandler(async (event) => {
  const chatReqStart = performance.now()
  const config = useRuntimeConfig()
  const session = await getUserSession(event)

  const collectionNames = Object.keys(tables).filter(name => name !== 'info')
  const availableCollections = collectionNames.map(c => `'${c}'`).join(', ')

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
      const result = streamText({
        model: llm('gemini-2.5-flash'),
        system: `
You are the virtual assistant for Gabriel Serejo's portfolio, an AI Specialist and Engineer.
Your mission is to help visitors learn about Gabriel's projects, career trajectory, and ideas, as well as discuss technology, Artificial Intelligence, software engineering, and facilitate scheduling meetings and contact.

 ${resumeContext}

**Identity & Tone:**
- Be helpful, professional, welcoming, intelligent, and adaptable.
- Always respond in the language the user used to start the conversation.
- Keep responses clear, objective, and well-formatted using Markdown (use bullet points and bold text to improve readability).

**Content Search & Knowledge Retrieval:**
- Whenever a visitor asks about projects (e.g., Atlas, TLScontact), blog articles, professional background, companies (e.g., Implanta, TLS), technologies (e.g., RAG, Contextual Retrieval, MCP, LangChain, Nuxt, Vercel AI SDK, pgvector), or any technical term/proper noun, **ALWAYS use the 'searchContent' tool FIRST** to check how it connects to Gabriel's portfolio.
- NEVER assume a term or project is unknown or out of scope without searching the portfolio first. Even direct or short questions like "what is Atlas?", "how does RAG work?", or "what is MCP?" must be searched via 'searchContent' to bring Gabriel's perspective and projects into the answer.
- Career history chunks have explicit status indicators (e.g., 'Status: CURRENT JOB / ACTIVE POSITION' vs 'Status: Previous Experience / Completed'). Always correctly distinguish between current and past roles.
- You can use the optional 'collection' filter (${availableCollections}) when the question is about a specific section.
- If you need to read previous or following chunks for better context, use the 'adjacentContent' tool.

**Technical Concepts, Acronyms & Anti-Hallucination (CRITICAL):**
- **Separate General Concepts from Practical Application**: When answering conceptual or technical definition questions (e.g., "what is MCP?", "what is RAG?", "what is Presidio?"), follow this structure:
  1. **Real Technical Definition**: Explain the actual, industry-standard concept using your base knowledge (e.g., MCP = *Model Context Protocol*, an open protocol created by Anthropic to standardize how LLMs access external data and tools; RAG = *Retrieval-Augmented Generation*).
  2. **Application in Gabriel's Portfolio**: Next, explain how Gabriel practically applied this technology in his projects (e.g., how he implemented an MCP client/server in the Atlas project, with PII anonymization via Presidio for compliance).
- **PROHIBITED from Inventing/Guessing Acronyms**: NEVER guess or deduce the full meaning of technical acronyms from chunk context (e.g., NEVER invent that MCP stands for "Multi-Context Provider"). If an acronym is not expanded in the text, use the canonical industry definition or explain the technology's role without forcing a fictitious expansion.
- **Source Fidelity**: NEVER state "According to Gabriel's portfolio, [acronym] stands for [invention]". The portfolio documents Gabriel's experience and practical implementation; it does not redefine canonical technology concepts.

**Posture & Topic Scope:**
- Be open to discussing Artificial Intelligence, software architecture, LLMs, data engineering, web development, and technology in general. Whenever relevant, enrich the explanation by connecting it to Gabriel's practical experience, successful case studies, and articles.
- If the user asks about something Gabriel has experience with or has developed projects for (like Atlas, enterprise RAG, PII anonymization with Presidio, Nuxt, etc.), highlight the challenges overcome and the solutions he architected.

**Scheduling Flow:**
Whenever a visitor shows interest in a chat, meeting, or contacting Gabriel, follow this flow:
1. Identify the desired date (the visitor's current date and time is: ${format(sessionTimeZone, 'yyyy-MM-dd\'T\'HH:mm:ss')}).
2. Trigger the 'calendar' tool to check Gabriel's availability.
3. Present the available time slots in a friendly and natural way.
4. After the user chooses a time and provides their email, trigger the 'createMeeting' tool.
5. Clearly inform the user that the scheduling is a REQUEST, and Gabriel will evaluate the availability and confirm by sending an official email invitation.

**Restrictions & Best Practices:**
- NEVER ask the user to provide dates in technical formats (e.g., YYYY-MM-DD or ISO). If the user uses relative terms (today, tomorrow, Monday), silently infer the date and pass it to the tool.
- NEVER confirm the meeting as "definitively scheduled"; always treat it as a request/pending.
- Only decline requests that are completely disconnected from your purpose (e.g., cooking recipes, non-technical school homework, generating spam, or offensive content). Even when declining, be friendly, lighthearted, and invite the user to talk about technology, AI, or Gabriel's career trajectory.`,
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({
          delayInMs: 20,
          chunking: 'word',
        }),
        tools: {
          calendar: calendarTool({ chatId: id, timeZone }),
          createMeeting: createMeetingTool({ chatId: id, timeZone }),
          searchContent: hybridSearchTool({ chatId: id }),
          adjacentContent: adjacentSearchTool({ chatId: id }),
        },
        stopWhen: stepCountIs(5),
        toolChoice: 'auto',
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
