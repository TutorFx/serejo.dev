import type { Prisma } from '@prisma/client'
import type { H3Event } from 'h3'
import { defu } from 'defu'

export async function setupGuest(event: H3Event, select: Prisma.GuestSelect | null = null) {
  const prisma = usePrisma()
  const id = getCookie(event, COOKIE_KEYS.GUEST)

  if (id) {
    const guest = await asyncEnvelope(async () => await prisma.guest.findUnique({
      where: { id },
      select: defu(select, { id: true }),
    }))

    if (guest.data) {
      return guest.data
    }
  }

  const createdGuest = await asyncEnvelope(async () => await prisma.guest.create({
    data: { id },
    select: defu(select, { id: true }),
  }))

  if (!createdGuest.data || createdGuest.error) {
    sendError(
      event,
      createError({
        statusCode: 400,
        data: createdGuest.error?.message,
      }),
    )

    return null
  }

  setCookie(event, COOKIE_KEYS.GUEST, createdGuest.data.id)

  return createdGuest.data
}
