import { defineHandler } from "nitro";

export default defineHandler(async (_event) => {
  return new Response("ok");
});
