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

export const formFillingTool = (event: H3Event) => tool(
  async function (input) {
    console.log('form-filling')
    const prisma = usePrisma()
    const guest = await setupGuest(event)
    console.log('guest', guest?.id)
    if (!guest) return 'Error: invalid guest id (not your fault)'

    console.log('input', input)
    const partialUser = userSchema.safeParse(input)
    if (!partialUser.data || partialUser.error) return 'Error on parse query';

    const res = await asyncEnvelope(async () => await prisma.user.upsert({
      where: {
        id: guest.id,
      },
      update: {
        ...partialUser.data
      },
      create: {
        id: guest.id,
        ...partialUser.data
      },
      select: {
        name: true,
        description: true,
        email: true,
        phone: true,
      }
    }));

    if (!res.data || res.error) return 'failed to insert data'

    return JSON.stringify(res.data)
  },
  {
    name: "form_filling_tool",
    description: "A tool to perform the form filling for the user. It is necessary to fill in at least one field of the object.",
    schema: userSchema,
  }
)

export const getUserDataTool = (event: H3Event) => tool(
  async function () {
    console.log('form-getter')
    const prisma = usePrisma()
    const guest = await setupGuest(event)

    if (!guest) return 'Error: invalid guest id (not your fault)'

    const res = await asyncEnvelope(async () => await prisma.user.findUnique({
      where: {
        id: guest.id,
      },
      select: {
        name: true,
        description: true,
        email: true,
        phone: true,
      }
    }));

    if (!res.data || res.error) return 'not registered'

    return JSON.stringify(res.data)
  },
  {
    name: "get_userdata_tool",
    description: "A tool to read users data",
  }
)