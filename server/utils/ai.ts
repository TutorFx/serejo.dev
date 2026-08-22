import type { z } from 'zod/v4'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { geminiEnvSchema } from './env.schemas'

type AiConfig = Partial<z.infer<typeof geminiEnvSchema>>

export function useAi(runtimeConfig?: AiConfig) {
  const apiKeyInput = runtimeConfig?.apiKey ?? (useRuntimeConfig().gemini?.apiKey as string | undefined)
  const { apiKey } = geminiEnvSchema.parse({
    apiKey: apiKeyInput,
  })

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  return {
    google,
    llm: google('gemini-2.5-flash'),
    embeddingModel: google.embedding('gemini-embedding-2'),
  }
}
