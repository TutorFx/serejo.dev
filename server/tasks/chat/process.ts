import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 3000,
});

export default defineTask({
  meta: {
    name: "chat:process",
  },
  async run({ payload, context }) {
    const prisma = usePrisma();

    // 1. Lógica da query corrigida para 'lt' (less than)
    const chats = await prisma.chat.findMany({
      where: {
        lastProcessed: {
          lt: prisma.chat.fields.updatedAt,
        },
        guestId: {
          not: null,
        },
      },
      select: {
        id: true,
        guestId: true,
      },
      take: 3000
    });

    const processingPromises = chats.map((chat) => {
      return limiter.schedule(async () => {
        const { guestId, id: chatId } = chat;
        console.warn('Iniciando processamento de ', guestId)
        if (!guestId) return null;

        // 2. Lógica de extração de dados reativada
        const processedChat = await extractUserDataFromChat(chatId);

        if (!processedChat) {
          console.error(`Falha ao extrair dados do chat ${chatId}`);
          return null;
        }

        const user = await asyncEnvelope(async () =>
          prisma.user.upsert({
            where: {
              // Assumindo que o ID do usuário é o mesmo do guestId
              id: guestId, 
            },
            update: {
              ...processedChat,
            },
            create: {
              id: guestId,
              ...processedChat,
            },
            select: {
              name: true,
              business: true,
              description: true,
              email: true,
              phone: true,
              agentNotes: true,
            },
          })
        );

        if (user.error) {
          console.error(`Erro ao processar o chat ${chatId}:`, user.error);
          return null;
        }

        if (user.data) {
          // Atualiza o campo lastProcessed para evitar reprocessamento
          await prisma.chat.update({
            where: { id: chatId },
            data: { lastProcessed: new Date() },
          });
        }

        return user.data;
      });
    });

    const results = await Promise.all(processingPromises);
    const successfulResults = results.filter(r => r !== null);
    
    return { result: `Processamento concluído para ${successfulResults.length} de ${chats.length} chats elegíveis.` };
  },
});