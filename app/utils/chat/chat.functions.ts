export function useChat() {
  const messages = ref<MessageType[]>([])
  const agent = ref<AiAgentTypes>(AI_AGENT.FELINA)
  const status = ref<MessageStatus>(MESSAGE_STATUS.IDLE)

  const model = ref('')
  const stream = ref('')

  const { locale } = useI18n()

  async function sendMessage(message: string | undefined) {
    if (!message)
      return
    status.value = MESSAGE_STATUS.PENDING

    const response = await asyncEnvelope(async () => await $fetch('/api/chat', {
      method: 'POST',
      body: {
        message: model.value,
        history: messages.value,
        agent: agent.value,
        lang: locale.value,
      } satisfies ChatPostDto,
      responseType: 'stream',
    }) as ReadableStream)

    status.value = MESSAGE_STATUS.SUCCESS

    messages.value.push({
      agentType: AGENT_TYPE.USER,
      message: model.value,
    })

    model.value = ''

    if (!response.data) {
      return status.value = MESSAGE_STATUS.ERROR
    }

    const reader = response.data.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      status.value = MESSAGE_STATUS.STREAMING
      const { done, value } = await reader.read()

      if (done) {
        messages.value.push({
          agentType: AGENT_TYPE.AI,
          agent: agent.value,
          message: stream.value,
        })

        stream.value = ''
        status.value = MESSAGE_STATUS.IDLE

        break
      }

      stream.value += decoder.decode(value, { stream: true })
    }
  }

  return {
    messages,
    agent,
    model,
    stream,
    status,
    sendMessage,
  }
}
