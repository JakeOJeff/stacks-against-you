// server.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || "3000");

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Be strict in production!
    },
  });

  // 🔌 Socket.io logic
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join-room", ({ room, userName }) => {
      socket.join(room);
      console.log(`➡️ ${userName} joined room ${room}`);
      socket.to(room).emit("user-joined", `${userName} joined the chat`);
    });

    socket.on("send-message", ({ room, sender, message }) => {
      io.to(room).emit("message", { sender, message });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  // 👇 Next.js handles all other requests
  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
