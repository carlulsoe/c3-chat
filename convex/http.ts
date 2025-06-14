import { streamChat } from "./chat";
import { httpRouter } from "convex/server";
const http = httpRouter();

http.route({
  path: "/chat-stream",
  method: "POST",
  handler: streamChat,
});

export default http;
