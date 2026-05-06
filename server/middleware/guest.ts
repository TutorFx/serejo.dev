export default defineEventHandler(async (event) => {
  const guest = await setupGuest(event)
  event.context.guest = guest
})
