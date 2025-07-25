export default defineEventHandler(async (event) => {
  return await setupGuest(event)
})
