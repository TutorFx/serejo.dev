import type { User } from '#auth-utils'
import { defu } from 'defu'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod/v4'

const gitHubOAuthUserSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(String),
  login: z.string().min(1, 'GitHub username is required'),
  name: z.string().trim().min(1).nullish().transform(val => val || null),
  email: z.email().nullish().or(z.literal('').transform(() => null)),
  avatar_url: z.url().nullish().or(z.literal('').transform(() => null))
})

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user: ghUser }) {
    const session = await getUserSession(event)
    const db = useDrizzle()

    const ghResult = gitHubOAuthUserSchema.safeParse(ghUser)
    if (!ghResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid GitHub user data',
        data: z.treeifyError(ghResult.error)
      })
    }

    const ghParsed = ghResult.data

    let user = await db.query.users.findFirst({
      where: () => and(
        eq(schema.users.provider, 'github'),
        eq(schema.users.providerId, ghParsed.id)
      )
    })

    if (!user) {
      const [newUser] = await db.insert(schema.users).values({
        id: session.id,
        name: ghParsed.name ?? ghParsed.login,
        email: ghParsed.email,
        username: ghParsed.login,
        provider: 'github',
        providerId: ghParsed.id
      }).returning()
      user = newUser
    }

    if (!user) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to create or find user' })
    }

    if (session.id) {
      await db.update(schema.chats).set({
        userId: user.id
      }).where(eq(schema.chats.userId, session.id))
    }

    const userData: User = defu(
      {
        id: user.id,
        name: user.name || undefined,
        email: user.email || undefined,
        username: user.username || undefined,
        provider: user.provider,
        providerId: user.providerId
      },
      {
        id: session.id,
        name: ghParsed.name ?? ghParsed.login,
        email: ghParsed.email ?? '',
        avatar: ghParsed.avatar_url ?? '',
        username: ghParsed.login,
        provider: 'github' as const,
        providerId: ghParsed.id
      }
    ) as User

    await setUserSession(event, {
      user: userData
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
