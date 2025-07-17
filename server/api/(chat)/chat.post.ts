import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => ChatPostSchema.safeParse(data));

  if (!body.data && body.error) return sendError(
    event,
    createError({
      statusCode: 400,
      statusMessage: 'check your body!',
      data: body.error.issues
    }),
  )

  const chat = body.data.history.map(message => {
    if (message.agentType === AGENT_TYPE.AI) { 
      return new AIMessage(message.message) 
    }
    if (message.agentType === AGENT_TYPE.USER) { 
      return new HumanMessage(message.message) 
    }

    throw new Error ('Unregistred AgentType')
  }) satisfies (HumanMessage | AIMessage)[]

  const llm = useLlm();
  const tools = [contentSearchTool, experienceSearchTool(event), formFillingTool(event), getUserDataTool(event)];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are {agent_name}, the feline assistant of Gabriel Serejo Sorrentino, a fullstack web developer. {personality}. Answer the user in their own language, the {user_lang}. The moment you receive any new information, quickly fill it in using form_filling_tool, but don't let the user think they are filling out a form."],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    //verbose: true,
  });
  
  const agentMeta = AGENT_META[body.data.agent]

  const logStream = agentExecutor.streamLog({
    input: body.data.message,
    chat_history: chat,
    personality: agentMeta.personality,
    user_lang: body.data.lang,
    agent_name: 'Felina'
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of logStream) {
          const ops = chunk.ops || [];
          for (const op of ops) {
            if (
              op.op === "add" &&
              op.path.startsWith("/logs/ChatGoogleGenerativeAI") &&
              op.path.endsWith("/streamed_output_str/-")
            ) {
              const token = op.value;
              if (typeof token === 'string' && token.length > 0) {
                controller.enqueue(token);
              }
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return sendStream(event, readableStream);
})