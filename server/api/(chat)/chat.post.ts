import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => ChatPostSchema.safeParse(data))

  const AGENT_ID = AI_AGENT.FELINA

  if (!body.data && body.error) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'check your body!',
        data: body.error.issues,
      }),
    )
  }

  const chat = body.data.history.map((message) => {
    if (message.agentType === AGENT_TYPE.AI) {
      return new AIMessage(message.message)
    }
    if (message.agentType === AGENT_TYPE.USER) {
      return new HumanMessage(message.message)
    }

    throw new Error ('Unregistred AgentType')
  }) satisfies (HumanMessage | AIMessage)[]

  const prisma = usePrisma()
  const llm = useLlm({ streaming: true })
  const tools = [contentSearchTool, experienceSearchTool(event), formFillingTool(event), getUserDataTool(event)]

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are {agent_name}, the feline assistant of Gabriel Serejo Sorrentino, a fullstack web developer. {personality}. Answer the user in their own language, the {user_lang}. The moment you receive any new information, quickly fill it in using form_filling_tool, but don\'t let the user think they are filling out a form.'],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ])

  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  })

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    // verbose: true,
  })

  const agentMeta = AGENT_META[body.data.agent]

  const logStream = agentExecutor.streamLog({
    input: body.data.message,
    chat_history: chat,
    personality: agentMeta.personality,
    user_lang: body.data.lang,
    agent_name: 'Felina',
  })

  const guest = await setupGuest(event, { chat: true })

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of logStream) {
          const ops = chunk.ops || []
          for (const op of ops) {
            if (
              op.op === 'add'
              && op.path.startsWith('/logs/ChatGoogleGenerativeAI')
              && op.path.endsWith('/streamed_output_str/-')
            ) {
              const token = op.value
              if (typeof token === 'string' && token.length > 0) {
                controller.enqueue(token)
              }
            }
            if (
              op.op === 'replace'
              && op.path === '/final_output'
            ) {
              const message = op.value.output
              if (typeof message === 'string' && message.length > 0) {
                if (guest?.id) {
                  let chatId: string | null = null
                  if (guest.chat?.id) {
                    chatId = guest.chat?.id
                  }
                  else {
                    const chat = await asyncEnvelope(async () => await prisma.chat.create({ select: { id: true }, data: { guestId: guest?.id } }))
                    if (chat.data) {
                      chatId = chat.data.id
                    }
                  }

                  if (chatId) {
                    await prisma.message.createMany({ data:
                      [
                        messageToDb({ agentType: AGENT_TYPE.USER, message: body.data.message }, chatId, true),
                        messageToDb({ agentType: AGENT_TYPE.AI, agent: AGENT_ID, message }, chatId, true),
                      ],
                    })
                  }
                }
              }
            }
          }
        }
        controller.close()
      }
      catch (error) {
        controller.error(error)
      }
    },
  })

  return await sendStream(event, readableStream)
})
