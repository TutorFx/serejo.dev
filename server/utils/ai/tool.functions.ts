import { tool } from '@langchain/core/tools';
import { H3Event } from 'h3'

async function contentSearchFunction(query: string) {
  const index = useUpstashIndex()

  const results = await index.query({
    data: query,
    topK: 10,
    includeMetadata: true,
  })

  return `results for ${query}\n"""${results.map(result => `${result.metadata?.source}\n${result.metadata?._pageContentLC}\n`).join('---\n')}"""`; // Placeholder
}

export const contentSearchTool = tool(
  async function (input) {
    const { data } = searchQuerySchema.safeParse(input)
    if (!data) return 'Error on parse query'
    
    return await contentSearchFunction(data.query);
  },
  {
    name: "content_search",
    description: "A tool to perform searches at gabriel's website (blog, experiences, projects and education)",
    schema: searchQuerySchema,
  }
);

async function queryExperiencesFunction(event: H3Event) {
  const experiences = await queryCollection(event, 'history').where('id', 'LIKE', `%/${LOCALE_KEYS.EN_US}/%`).order("start", "DESC").all()

  return `places Gabriel worked: ${experiences.map(experience => `${experience.org} at ${experience.location} (from ${experience.start} to ${experience.end})`).join(', ')}`
}

export const experienceSearchTool = (event: H3Event) => tool(
  async function () {
    return await queryExperiencesFunction(event);
  },
  {
    name: "experience_search",
    description: "A tool to perform searches at gabriel's experiences",
  }
);