import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().describe("The search query to execute."),
})

export const userSchema = z.object({
  name: z.string().describe('Nome completo do usuário'),
  business: z.string().describe('Nome da empresa de quem entrou em contato'),
  email: z.string().optional().describe('Email de contato'),
  phone: z.string().describe('Número de telefone'),
  description: z.string().describe('Descrição de toda a conversa'),
  agentNotes: z.string().describe('O comentário do agente de IA sobre como foi essa conversa')
}).describe('Extraia o máximo de informações do que foi dito na conversa');

export const userPartialSchema = userSchema.partial().refine(
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: 'It is necessary to fill in at least one field of the object.',
  }
).describe('It is necessary to fill in at least one field');
