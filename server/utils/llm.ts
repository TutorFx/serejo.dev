import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { defu } from 'defu'

let _llm: ChatGoogleGenerativeAI;

export function useLlm (llmSettings?: Partial<{ model: string, streaming: boolean }>){

  const settings = defu({ model: "gemini-2.0-flash-lite", streaming: false }, llmSettings)
  if (!_llm) {
    _llm = new ChatGoogleGenerativeAI({
      model: settings.model,
      maxOutputTokens: 2048,
      apiKey: process.env.GEMINI_API_KEY!,
      streaming: settings.streaming,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  }
  return _llm
}