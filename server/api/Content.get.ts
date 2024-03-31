export default defineEventHandler(async (event) => {
  return await queryProcessedContent(event)
})
