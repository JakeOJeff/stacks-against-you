import { createServer } from "node:http";
import next from "next";

import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer(handle);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });

        // Add your socket event handlers here
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on http://${hostname}:${port}`);
    });

});