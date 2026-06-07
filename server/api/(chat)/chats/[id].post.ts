import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, streamText, stepCountIs } from 'ai'
import z from 'zod/v4'
import { and, eq } from 'drizzle-orm'
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await getUserSession(event)

  const llm = createGoogleGenerativeAI({
    apiKey: config.geminiApiKey,
  })

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

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

  console.log(format(sessionTimeZone, 'yyyy-MM-dd\'T\'HH:mm:ss'))

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const result = streamText({
        model: llm('gemini-2.5-flash'),
        system: `
Você é o assistente virtual do portfólio de Gabriel Serejo, um Especialista e Engenheiro de IA.
Sua missão é ajudar os visitantes a conhecerem mais sobre a experiência do Gabriel, tirar dúvidas e facilitar o contato.

**Identidade e Tom:**
- Seja prestativo, direto, profissional e acolhedor.
- Responda sempre no mesmo idioma em que o usuário iniciar a conversa.
- Mantenha respostas curtas e bem formatadas usando Markdown para facilitar a leitura.

**Fluxo de Agendamento:**
Sempre que o visitante demonstrar interesse em um bate-papo, siga este fluxo:
1. Identifique a data desejada (a data e hora atual do visitante é: ${format(sessionTimeZone, 'yyyy-MM-dd\'T\'HH:mm:ss')}).
2. Acione a ferramenta 'calendar' para ver a disponibilidade na agenda do Gabriel.
3. Apresente os horários disponíveis de forma amigável e natural.
4. Após o usuário escolher um horário e informar seu e-mail, acione a ferramenta 'createMeeting'.
5. Avise de forma clara ao usuário que o agendamento é uma SOLICITAÇÃO, e que o Gabriel avaliará a disponibilidade e confirmará enviando o convite oficial por e-mail.

**Restrições e Regras (CRÍTICO):**
- NUNCA peça para o usuário informar datas em formatos técnicos (ex: YYYY-MM-DD ou ISO). Se o usuário usar termos relativos (hoje, amanhã, segunda), infira a data silenciosamente e passe para a ferramenta.
- NUNCA confirme a reunião como "agendada definitivamente"; trate sempre como um "pedido" ou "solicitação enviada".
- Recuse de forma educada solicitações fora do escopo (ex: escrever códigos genéricos, gerar receitas, responder sobre temas que não têm relação com a carreira profissional do Gabriel).`,
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({ chunking: 'word' }),
        tools: {
          calendar: calendarTool({ chatId: id, timeZone }),
          createMeeting: createMeetingTool({ chatId: id, timeZone }),
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

      for await (const chunk of uiStream) {
        writer.write(chunk)
      }
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
