// lib/socketClient.ts
import { io } from "socket.io-client";

export const socket = io("https://stacks-against-you.onrender.com", {
  path: "/socket.io",
});
