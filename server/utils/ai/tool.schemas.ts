import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().describe("The search query to execute."),
})

export const userSchema = z.object({
  name: z.string().describe('Users name'),
  email: z.string().describe('Email contact of the user'),
  phone: z.number().describe('Users phone number / whatsapp number'),
  description: z.string().describe('Stores user last interaction info')
});

export const userPartialSchema = userSchema.partial().refine(
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: 'It is necessary to fill in at least one field of the object.',
  }
).describe('It is necessary to fill in at least one field');
