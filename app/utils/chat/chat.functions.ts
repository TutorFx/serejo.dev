export function useChat() {
  const messages = ref<MessageType[]>([])
  const agent = ref<AiAgentTypes>(AI_AGENT.FELINA)
  const status = ref<MessageStatus>(MESSAGE_STATUS.IDLE)

  const model = ref('')
  const stream = ref('')

  const { locale } = useI18n()

  /**
   * Private helper function to process the readable stream from the API.
   * This isolates the stream-reading logic from the main send function.
   * @param dataStream The ReadableStream to process.
   */
  async function _processStream(dataStream: ReadableStream) {
    const reader = dataStream.getReader()
    const decoder = new TextDecoder('utf-8')
    let streamedMessage = ''

    status.value = MESSAGE_STATUS.STREAMING

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        messages.value.push({
          agentType: AGENT_TYPE.AI,
          agent: agent.value,
          message: streamedMessage,
        })
        stream.value = '' // Clear the public stream ref
        status.value = MESSAGE_STATUS.IDLE
        break
      }

      const decodedChunk = decoder.decode(value, { stream: true })
      streamedMessage += decodedChunk
      // Update the public stream ref for real-time UI updates
      stream.value = streamedMessage
    }
  }

  /**
   * Sends a message to the chat API and handles the streamed response.
   * @param message The message content from the user input.
   */
  async function sendMessage(message: string | undefined) {
    if (!message || status.value === MESSAGE_STATUS.PENDING)
      return

    status.value = MESSAGE_STATUS.PENDING

    messages.value.push({
      agentType: AGENT_TYPE.USER,
      message: model.value,
    })

    const messageToSend = model.value
    model.value = ''

    const response = await asyncEnvelope(async () => await $fetch('/api/chat', {
      method: 'POST',
      body: {
        message: messageToSend,
        history: messages.value.slice(0, -1),
        agent: agent.value,
        lang: locale.value,
      } satisfies ChatPostDto,
      responseType: 'stream',
    }) as ReadableStream)

    if (!response.data) {
      status.value = MESSAGE_STATUS.ERROR
      messages.value.push({
        agentType: AGENT_TYPE.AI,
        agent: agent.value,
        message: 'Sorry, an error occurred while sending the message.',
      })
      return
    }

    await _processStream(response.data)
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
