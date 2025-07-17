import type { H3Event } from 'h3'

export async function setupGuest(event: H3Event) {
  const prisma = usePrisma()
  const id = getCookie(event, COOKIE_KEYS.GUEST)

  if (id) {
    const guest = await asyncEnvelope(async () => await prisma.guest.findUnique({
      where: { id },
      select: { id: true }
    }))

    if (guest.data) {
      return guest.data
    }
  }

  const createdGuest = await asyncEnvelope(async () => await prisma.guest.create({
    data: { id },
    select: {
      id: true,
    },
  }))

  if (!createdGuest.data || createdGuest.error) {
    sendError(
      event,
      createError({
        statusCode: 400,
        data: createdGuest.error?.message
      }),
    )

    return null
  }

  setCookie(event, COOKIE_KEYS.GUEST, createdGuest.data.id)

  return createdGuest.data
}