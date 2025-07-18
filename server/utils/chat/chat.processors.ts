import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentType } from "@prisma/client";

export async function extractUserDataFromChat(chatId: string) {
  const prisma = usePrisma();
  const llm = useLlm({ model: 'gemini-2.5-pro' });
  console.log('rodou')

  const chat = await asyncEnvelope(async () => await prisma.chat.findUnique({ where: { id: chatId }, include: { messages: { take: 200 } } }))

  if (!chat.data) return null;


  const messages = chat.data.messages.map(message => {
    if (message.agentType === AgentType.MODEL) { 
      return new AIMessage(message.message) 
    }
    if (message.agentType === AgentType.USER) { 
      return new HumanMessage(message.message) 
    }

    throw new Error ('Unregistred AgentType')
  }) satisfies (HumanMessage | AIMessage)[]
  
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Você é um especialista em extrair informações de conversas. Analise o histórico de chat e extraia os detalhes do usuário. Se uma informação não for encontrada, deixe o campo em branco."],
    ["human", "Por favor, extraia os dados do usuário do seguinte histórico de chat:\n\n---\n\n{chat_history}\n\n---"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const structuredLlm = llm.withStructuredOutput(userSchema);

  const chain = prompt.pipe(structuredLlm);

  return await chain.invoke({
    chat_history: messages,
  });
}