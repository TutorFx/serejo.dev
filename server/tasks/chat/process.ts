export default defineTask({
  meta: {
    name: "chat:process",
  },
  run({ payload, context }) {
    console.log("Testing cron job...");
    return { result: "Success" };
  },
});