import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().describe("The search query to execute."),
})